import { test, expect, type Page } from '@playwright/test';

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/');
  });

  test('shows splash screen then redirects to login', async ({ page }: { page: Page }) => {
    const splash = page.locator('[data-testid="splash-screen"]');
    await expect(splash).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('full user journey: signup, create habit, and logout', async ({ page }: { page: Page }) => {
    // 1. Signup
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'user@test.com');
    await page.fill('[data-testid="auth-signup-password"]', 'password123');
    await page.click('[data-testid="auth-signup-submit"]');
    
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();

    // 2. Create Habit
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Morning Run');
    await page.fill('[data-testid="habit-description-input"]', '5km at the park');
    await page.click('[data-testid="habit-save-button"]');
    
    const habitCard = page.locator('[data-testid="habit-card-morning-run"]');
    await expect(habitCard).toBeVisible();

    // 3. Toggle Completion
    const completeBtn = page.locator('[data-testid="habit-complete-morning-run"]');
    await expect(completeBtn).toHaveText('Mark Done');
    await completeBtn.click();
    await expect(completeBtn).toHaveText('Completed');

    // 4. Logout
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL('**/login');
  });

  test('persists habits across sessions', async ({ page }: { page: Page }) => {
    await page.evaluate(() => {
      const mockUser = { id: 'user-123', email: 'persist@test.com' };
      const mockHabit = {
        id: 'h-1',
        userId: 'user-123',
        name: 'Sleep Early',
        description: 'Before 11pm',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: []
      };
      localStorage.setItem('habit-tracker-session', JSON.stringify(mockUser));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([mockHabit]));
    });

    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="habit-card-sleep-early"]')).toBeVisible();
  });
});