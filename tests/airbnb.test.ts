import { test, expect } from '@playwright/test';

test.describe('First', () => {
    test('open google', async ({page}) => {
        await page.goto('https://www.airbnb.com/');
        await page.pause();
    });
})