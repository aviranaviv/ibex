import { expect, test } from '@playwright/test';

import AirbnbHomePage from '@/page-objects/airbnb-home-page';

let homePage: AirbnbHomePage;

const expectedDestinations = 'Amsterdam';

test.describe('Airbnb', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new AirbnbHomePage(page);
    });

    test('Airbnb booking flow validation', async ({ page }) => {
        await homePage.openHomePage();
        await homePage.searchAndSelectDestinations(expectedDestinations);
        await page.pause();
    });
});
