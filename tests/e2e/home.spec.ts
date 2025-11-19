import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Timeline/i);
    // Check for the main hero heading text (with comma to be specific)
    await expect(page.getByText('YOUR JOURNEY,').first()).toBeVisible();
  });

  test('should display navigation bar', async ({ page }) => {
    // Wait for page to load, then check for navbar elements
    await page.waitForLoadState('networkidle');
    
    // Look for the TIMELINE logo text in the navbar
    const navbarLogo = page.getByRole('heading', { name: 'TIMELINE', exact: true }).first();
    await expect(navbarLogo).toBeVisible();
  });

  test('should navigate to auth page when clicking Get Started', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Click the link that goes to /auth (the Get Started button is inside this link)
    const authLink = page.locator('a[href="/auth"]').first();
    await expect(authLink).toBeVisible();
    
    // Click and wait for navigation
    await Promise.all([
      page.waitForURL(/\/auth/, { timeout: 10000 }),
      authLink.click()
    ]);
    
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should navigate to explore page when clicking Explore Now', async ({ page }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Click the link that goes to /explore (the Explore Now button is inside this link)
    const exploreLink = page.locator('a[href="/explore"]').first();
    await expect(exploreLink).toBeVisible();
    
    // Click and wait for navigation
    await Promise.all([
      page.waitForURL(/\/explore/, { timeout: 10000 }),
      exploreLink.click()
    ]);
    
    await expect(page).toHaveURL(/\/explore/);
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Verify footer contains copyright text
    await expect(footer).toContainText(/© 202[4-9]/);
  });

  test('should have proper meta tags', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known third-party errors if any
    const relevantErrors = errors.filter(error => 
      !error.includes('third-party') && 
      !error.includes('extension')
    );
    
    expect(relevantErrors).toHaveLength(0);
  });
});

