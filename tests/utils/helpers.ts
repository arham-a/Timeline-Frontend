import { Page, expect } from '@playwright/test';

/**
 * Wait for an element to be visible with custom timeout
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, urlPattern: string | RegExp) {
  await page.waitForURL(urlPattern, { timeout: 10000 });
}

/**
 * Fill form field with validation
 */
export async function fillField(page: Page, selector: string, value: string) {
  const field = page.locator(selector);
  await expect(field).toBeVisible();
  await field.fill(value);
  await expect(field).toHaveValue(value);
}

/**
 * Click button and wait for response
 */
export async function clickAndWait(page: Page, selector: string, waitForUrl?: string | RegExp) {
  const button = page.locator(selector);
  await expect(button).toBeVisible();
  await button.click();
  
  if (waitForUrl) {
    await page.waitForURL(waitForUrl, { timeout: 10000 });
  }
}

/**
 * Check if element exists without throwing error
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  return await page.locator(selector).count() > 0;
}

/**
 * Wait for API call to complete
 */
export async function waitForApiCall(page: Page, urlPattern: string | RegExp) {
  await page.waitForResponse(response => {
    const url = response.url();
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  }, { timeout: 10000 });
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  response: { status: number; body: any }
) {
  await page.route(urlPattern, route => {
    route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response.body),
    });
  });
}

/**
 * Take screenshot with custom name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingToComplete(page: Page) {
  // Wait for common loading indicators to disappear
  const loadingSelectors = [
    '[class*="loading"]',
    '[class*="spinner"]',
    'text=/loading/i',
  ];
  
  for (const selector of loadingSelectors) {
    const element = page.locator(selector);
    if (await element.count() > 0) {
      await element.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Get text content of element
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();
  return await element.textContent() || '';
}

/**
 * Check if page has no console errors
 */
export async function checkNoConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, message?: string | RegExp) {
  const toastSelector = '[class*="toast"]';
  await page.waitForSelector(toastSelector, { state: 'visible', timeout: 5000 });
  
  if (message) {
    const toast = page.locator(toastSelector);
    if (typeof message === 'string') {
      await expect(toast).toContainText(message);
    } else {
      await expect(toast).toContainText(message);
    }
  }
}

/**
 * Dismiss toast notification
 */
export async function dismissToast(page: Page) {
  const closeButton = page.locator('[class*="toast"] button').or(
    page.locator('[aria-label="Close"]')
  );
  
  if (await closeButton.count() > 0) {
    await closeButton.first().click();
  }
}

/**
 * Select option from dropdown
 */
export async function selectDropdownOption(page: Page, dropdownSelector: string, optionText: string) {
  await page.locator(dropdownSelector).click();
  await page.locator(`text=${optionText}`).click();
}

/**
 * Upload file
 */
export async function uploadFile(page: Page, inputSelector: string, filePath: string) {
  const fileInput = page.locator(inputSelector);
  await fileInput.setInputFiles(filePath);
}

/**
 * Drag and drop element
 */
export async function dragAndDrop(page: Page, sourceSelector: string, targetSelector: string) {
  await page.locator(sourceSelector).dragTo(page.locator(targetSelector));
}

/**
 * Check accessibility violations (basic check)
 */
export async function checkBasicAccessibility(page: Page) {
  // Check for basic accessibility issues
  const issues: string[] = [];
  
  // Check for images without alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  if (imagesWithoutAlt > 0) {
    issues.push(`Found ${imagesWithoutAlt} images without alt text`);
  }
  
  // Check for buttons without accessible names
  const buttonsWithoutLabel = await page.locator('button:not([aria-label]):not(:has-text)').count();
  if (buttonsWithoutLabel > 0) {
    issues.push(`Found ${buttonsWithoutLabel} buttons without accessible names`);
  }
  
  return issues;
}

/**
 * Wait for specific time (use sparingly)
 */
export async function wait(ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
