# Playwright Quick Start Guide

## Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests with UI (recommended for development)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report

# Generate tests using codegen
npm run test:codegen
```

## Quick Test Examples

### Run specific test file
```bash
npx playwright test tests/e2e/home.spec.ts
```

### Run tests matching a pattern
```bash
npx playwright test -g "should login"
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests with trace
```bash
npx playwright test --trace on
```

## Project Structure

```
frontend/
├── tests/
│   ├── e2e/                    # End-to-end tests
│   │   ├── home.spec.ts
│   │   ├── auth.spec.ts
│   │   └── explore.spec.ts
│   ├── fixtures/               # Test data
│   │   ├── auth.ts
│   │   └── test-data.ts
│   ├── utils/                  # Helper functions
│   │   └── helpers.ts
│   └── accessibility/          # A11y tests
│       └── a11y.spec.ts
├── playwright.config.ts        # Playwright configuration
└── .env.test                   # Test environment variables
```

## What's Included

✅ **Home Page Tests** - Hero section, navigation, features
✅ **Auth Tests** - Login, signup, validation, protected routes
✅ **Explore Tests** - Timeline listing, search, filters
✅ **Accessibility Tests** - Keyboard navigation, ARIA, focus management
✅ **Helper Functions** - Reusable test utilities
✅ **Test Fixtures** - Mock data and auth helpers

## Next Steps

1. **Install dependencies**: `npm install -D @playwright/test`
2. **Install browsers**: `npx playwright install`
3. **Start dev server**: `npm run dev` (in another terminal)
4. **Run tests**: `npm run test:ui`
5. **Add data-testid attributes** to your components for easier testing
6. **Customize tests** based on your actual implementation

## Tips

- Use `page.pause()` to debug tests interactively
- Use `--headed` flag to see browser actions
- Use `--ui` mode for the best development experience
- Add `data-testid` attributes to make selectors more reliable
- Keep tests independent and isolated
- Use fixtures for consistent test data

## Common Issues

**Tests fail with "Timeout"**
- Increase timeout in playwright.config.ts
- Check if dev server is running
- Use `waitForLoadState('networkidle')`

**Element not found**
- Use more flexible selectors
- Add proper wait conditions
- Check if element is in viewport

**Flaky tests**
- Avoid hard-coded waits (`page.waitForTimeout`)
- Use proper wait conditions
- Ensure test independence

## Resources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
