import { test, expect, type Page } from '@playwright/test';

test.describe('Habit Tracker app', () => {

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    const splash = page.locator('[data-testid="splash-screen"]');
    await expect(splash).toBeVisible();
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup');
    await page.fill('[data-testid="auth-signup-email"]', 'newuser@test.com');
    await page.fill('[data-testid="auth-signup-password"]', 'password123');
    await page.click('[data-testid="auth-signup-submit"]');
    
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@test.com' }));
    });
    await page.goto('/dashboard');
    
    await page.click('[data-testid="create-habit-button"]');
    await page.fill('[data-testid="habit-name-input"]', 'Morning Run');
    await page.fill('[data-testid="habit-description-input"]', '5km');
    await page.click('[data-testid="habit-save-button"]');
    
    await expect(page.locator('[data-testid="habit-card-morning-run"]')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    const today = new Date().toISOString().split('T')[0];
    await page.goto('/');
    await page.evaluate((date) => {
      const user = { userId: 'u1', email: 'u1@test.com' };
      const habit = {
        id: 'h1', userId: 'u1', name: 'Water', frequency: 'daily',
        completions: [], createdAt: date
      };
      localStorage.setItem('habit-tracker-session', JSON.stringify(user));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));
    }, today);
    
    await page.goto('/dashboard');
    const completeBtn = page.locator('[data-testid="habit-complete-water"]');
    await expect(completeBtn).toHaveText('Mark Done');
    await completeBtn.click();
    await expect(completeBtn).toHaveText('Completed');
    await expect(page.locator('[data-testid="habit-streak-water"]')).toContainText('1 Day Streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/'); // Land on domain to set storage
    await page.evaluate(() => {
      const mockUser = { userId: 'user-123', email: 'persist@test.com' };
      const mockHabit = {
        id: 'h-1', userId: 'user-123', name: 'Sleep Early',
        frequency: 'daily', completions: [], createdAt: new Date().toISOString()
      };
      localStorage.setItem('habit-tracker-session', JSON.stringify(mockUser));
      localStorage.setItem('habit-tracker-habits', JSON.stringify([mockHabit]));
    });

    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="habit-card-sleep-early"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-testid="habit-card-sleep-early"]')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'u1@test.com' }));
    });
    await page.goto('/dashboard');
    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL('**/login');
    const session = await page.evaluate(() => localStorage.getItem('habit-tracker-session'));
    expect(session).toBeNull();
  });
});