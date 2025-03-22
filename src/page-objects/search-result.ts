import { expect, Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';


export default class SearchResult extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    async getRatingMap() {
        await this.page.waitForLoadState('domcontentloaded');
        const allResultsRating: Locator[] = await this.page.getByText('out of 5').all();
        for (const el of allResultsRating) {
            console.log(await el.innerText());
        }
    };
}
