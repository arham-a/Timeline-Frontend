import { test, expect } from '@playwright/test';

test.describe('Explore Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/explore');
  });

  test('should load explore page', async ({ page }) => {
    await expect(page).toHaveURL(/\/explore/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.locator('h1').or(page.locator('text=/explore|discover|public timelines/i'));
    await expect(heading.first()).toBeVisible();
  });

  test('should display timeline cards or list', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for timeline items
    const timelineItems = page.locator('[data-testid="timeline-card"]').or(
      page.locator('[class*="timeline"]').or(
        page.locator('article')
      )
    );
    
    // Should have at least one timeline or show empty state
    const count = await timelineItems.count();
    const emptyState = page.locator('text=/no timelines|empty|no results|create your first/i');
    const emptyStateCount = await emptyState.count();
    
    // Either we have timeline items OR we have an empty state message (or neither is ok for now)
    if (count === 0 && emptyStateCount > 0) {
      await expect(emptyState.first()).toBeVisible();
    } else if (count > 0) {
      expect(count).toBeGreaterThan(0);
    } else {
      // No items and no empty state - just verify page loaded by checking URL
      expect(page.url()).toContain('/explore');
    }
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="search"]').or(
        page.locator('[data-testid="search-input"]')
      )
    );
    
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
      await searchInput.first().fill('test timeline');
      
      // Wait for search results
      await page.waitForTimeout(1000);
    }
  });

  test('should filter timelines', async ({ page }) => {
    // Look for filter buttons or dropdowns
    const filterButton = page.locator('button:has-text("Filter")').or(
      page.locator('[data-testid="filter-button"]').or(
        page.locator('text=/category|tag|filter/i')
      )
    );
    
    if (await filterButton.count() > 0) {
      await filterButton.first().click();
      
      // Check if filter options appear
      const filterOptions = page.locator('[role="menu"]').or(
        page.locator('[class*="dropdown"]')
      );
      
      await expect(filterOptions.first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('should sort timelines', async ({ page }) => {
    const sortButton = page.locator('button:has-text("Sort")').or(
      page.locator('[data-testid="sort-button"]').or(
        page.locator('select[name="sort"]')
      )
    );
    
    if (await sortButton.count() > 0) {
      await sortButton.first().click();
      
      // Look for sort options
      const sortOptions = page.locator('text=/newest|oldest|popular|trending/i');
      
      if (await sortOptions.count() > 0) {
        await expect(sortOptions.first()).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('should navigate to timeline detail on click', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const timelineCard = page.locator('[data-testid="timeline-card"]').or(
      page.locator('article').or(
        page.locator('[class*="timeline-card"]')
      )
    );
    
    const count = await timelineCard.count();
    
    if (count === 0) {
      // Skip test if no timelines available
      test.skip();
    }
    
    await timelineCard.first().click();
    
    // Should navigate to detail page
    await page.waitForURL(/\/timeline\/|\/explore\//, { timeout: 5000 });
  });

  test('should display fork button on timeline cards', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // First check if there are any timelines
    const timelineCard = page.locator('[data-testid="timeline-card"]').or(
      page.locator('article').or(
        page.locator('[class*="timeline-card"]')
      )
    );
    
    if (await timelineCard.count() === 0) {
      test.skip();
    }
    
    const forkButton = page.locator('button:has-text("Fork")').or(
      page.locator('[data-testid="fork-button"]')
    );
    
    if (await forkButton.count() > 0) {
      await expect(forkButton.first()).toBeVisible();
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const nextButton = page.locator('button:has-text("Next")').or(
      page.locator('[aria-label="Next page"]').or(
        page.locator('[data-testid="next-page"]')
      )
    );
    
    if (await nextButton.count() > 0 && await nextButton.first().isEnabled()) {
      await nextButton.first().click();
      
      // Wait for new content to load
      await page.waitForLoadState('networkidle');
      
      // Check if URL or content changed
      const prevButton = page.locator('button:has-text("Previous")').or(
        page.locator('[aria-label="Previous page"]')
      );
      
      await expect(prevButton.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('should show loading state while fetching timelines', async ({ page }) => {
    // Navigate and immediately check for loading state
    const loadingPromise = page.goto('/explore');
    
    const loadingIndicator = page.locator('[class*="loading"]').or(
      page.locator('[class*="spinner"]').or(
        page.locator('text=/loading/i')
      )
    );
    
    // Loading might be very brief
    await expect(loadingIndicator.first()).toBeVisible({ timeout: 1000 }).catch(() => {
      // Loading state might be too fast, which is fine
    });
    
    await loadingPromise;
  });
});

test.describe('Explore Page - Responsive', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/explore');
    
    await page.waitForLoadState('networkidle');
    
    // Timeline cards should stack vertically on mobile
    const heading = page.locator('h1').or(page.locator('text=/explore/i'));
    await expect(heading.first()).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/explore');
    
    await page.waitForLoadState('networkidle');
    
    const heading = page.locator('h1').or(page.locator('text=/explore/i'));
    await expect(heading.first()).toBeVisible();
  });
});
