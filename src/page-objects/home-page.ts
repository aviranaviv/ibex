import { Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class HomePage extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigates to the Airbnb homepage.
     * @returns {Promise<void>} - Resolves when the page has loaded.
     */
    async openHomePage(): Promise<void> {
        await this.page.goto('https://www.airbnb.com/');
    }
}
