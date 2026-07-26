import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('ProjectPilot Critical User Journeys', () => {
  test('should successfully load dashboard and create a new project', async ({ page }) => {
    await setupClerkTestingToken({ page });
    
    await page.goto('/dashboard/projects');
    await expect(page.locator('text=Recommended Project blue-prints')).toBeVisible();

    const createProjectButton = page.locator('button:has-text("Create Project")').first();
    await createProjectButton.click();

    await page.fill('#project-title-input', 'E2E Test Automated Project');
    await page.fill('textarea[placeholder*="Briefly describe"]', 'Automated test description verifying golden path.');

    // Submit form (button also has text "Create Project")
    await page.click('form button[type="submit"]:has-text("Create Project")');
    await expect(page.locator('text=E2E Test Automated Project')).toBeVisible();
  });
});
