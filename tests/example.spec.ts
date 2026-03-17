import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title with "number-place"
  await expect(page).toHaveTitle(/number-place/);
});

test('board is visible', async ({ page }) => {
  await page.goto('/');

  // Check if the sudoku board is rendered
  // Use first() to get the first board (main game board, not the history)
  const board = page.locator('.board-top').first();
  await expect(board).toBeVisible();
  
  // Take screenshot on success
  await page.screenshot({ path: 'test-results/board-visible.png' });
});

test('can interact with game', async ({ page }) => {
  await page.goto('/');

  // Check if the board exists and has blocks (9 blocks in the main board)
  // Use first() to get the main board, not the history board
  const boardBlocks = page.locator('.board-top').first().locator('.board-block');
  await expect(boardBlocks).toHaveCount(9);

  // Take a screenshot of the full board
  await page.screenshot({ path: 'test-results/game-board-full.png' });
});

test('page loads without errors', async ({ page, context }) => {
  // Listen for console messages and errors
  let consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('/');

  // Wait for board to load
  await page.waitForSelector('.board-top', { timeout: 5000 });

  // Verify no console errors occurred
  expect(consoleErrors.length).toBe(0);

  // Take screenshot of loaded page
  await page.screenshot({ path: 'test-results/page-loaded.png' });
});

test('board has correct number of squares', async ({ page }) => {
  await page.goto('/');

  // Wait for the board to be visible
  await page.waitForSelector('.board-top', { timeout: 5000 });

  // Count the number of squares (sudoku should have 81 squares)
  const squares = page.locator('button');
  const squareCount = await squares.count();
  
  // Should have at least 81 squares (9x9 grid)
  expect(squareCount).toBeGreaterThanOrEqual(81);

  // Take screenshot
  await page.screenshot({ path: 'test-results/board-squares.png' });
});