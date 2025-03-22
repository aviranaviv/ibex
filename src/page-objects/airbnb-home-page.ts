import { expect, Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class AirbnbHomePage extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    readonly searchDestinationsInput: Locator = this.page.getByTestId('structured-search-input-field-query');
    readonly searchListContainer: Locator = this.page.getByTestId('structured-search-input-field-query-panel');

    async openHomePage() {
        await this.page.goto('https://www.airbnb.com/');
    }

    async searchAndSelectDestinations(name: string) {
        await this.searchDestinationsInput.fill(name);
        await expect(this.searchListContainer).toBeVisible();
    }
}
