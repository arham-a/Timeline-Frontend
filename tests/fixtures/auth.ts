import { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'Admin123!@#',
    name: 'Admin User'
  }
};

/**
 * Helper function to login a user
 */
export async function login(page: Page, user: TestUser) {
  await page.goto('/auth');
  
  const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
  const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
  
  await emailInput.first().fill(user.email);
  await passwordInput.first().fill(user.password);
  
  const submitButton = page.getByRole('button', { name: /sign in|login|log in/i });
  await submitButton.click();
  
  // Wait for navigation to complete
  await page.waitForURL(/\/timeline|\/dashboard|\/home/, { timeout: 10000 });
}

/**
 * Helper function to signup a new user
 */
export async function signup(page: Page, user: TestUser) {
  await page.goto('/auth');
  
  // Toggle to signup form if needed
  const signupToggle = page.getByRole('button', { name: /sign up|create account|register/i }).or(
    page.getByRole('link', { name: /sign up|create account|register/i })
  );
  
  if (await signupToggle.count() > 0) {
    await signupToggle.first().click();
  }
  
  // Fill signup form
  const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="name"]'));
  const emailInput = page.locator('input[type="email"]').or(page.locator('input[name="email"]'));
  const passwordInput = page.locator('input[type="password"]').or(page.locator('input[name="password"]'));
  
  if (user.name && await nameInput.count() > 0) {
    await nameInput.first().fill(user.name);
  }
  await emailInput.first().fill(user.email);
  await passwordInput.first().fill(user.password);
  
  const submitButton = page.getByRole('button', { name: /sign up|create account|register/i });
  await submitButton.click();
  
  // Wait for navigation
  await page.waitForURL(/\/timeline|\/dashboard|\/home/, { timeout: 10000 });
}

/**
 * Helper function to logout
 */
export async function logout(page: Page) {
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i }).or(
    page.locator('[data-testid="logout-button"]')
  );
  
  // Might need to open user menu first
  const userMenu = page.locator('[data-testid="user-menu"]').or(
    page.locator('button:has-text("Profile")').or(
      page.locator('[class*="user-menu"]')
    )
  );
  
  if (await userMenu.count() > 0) {
    await userMenu.first().click();
  }
  
  await logoutButton.first().click();
  
  // Wait for redirect to home or auth
  await page.waitForURL(/\/|\/auth/, { timeout: 5000 });
}

/**
 * Helper function to check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check for auth indicators
  const userMenu = page.locator('[data-testid="user-menu"]').or(
    page.locator('text=/logout|sign out|profile/i')
  );
  
  return await userMenu.first().isVisible().catch(() => false);
}

/**
 * Helper function to set auth token directly (for faster test setup)
 */
export async function setAuthToken(page: Page, token: string) {
  await page.context().addCookies([{
    name: 'auth_token',
    value: token,
    domain: 'localhost',
    path: '/',
  }]);
  
  // Or set in localStorage if your app uses that
  await page.evaluate((token) => {
    localStorage.setItem('auth_token', token);
  }, token);
}

/**
 * Helper function to clear auth state
 */
export async function clearAuth(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
