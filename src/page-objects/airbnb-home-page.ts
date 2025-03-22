import { Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class AirbnbHomePage extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    async openHomePage(): Promise<void> {
        await this.page.goto('https://www.airbnb.com/');
    }
}
