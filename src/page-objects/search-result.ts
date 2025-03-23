import { Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';


export default class SearchResult extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    readonly getCardByRated = (rated: number) => this.page.getByText(`${rated} out of 5`);

    async getRatingMap(): Promise<string[]> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load');

        const allResultsRating: Locator[] = await this.page.getByText('out of 5').all();
        const allResultsRatingText: string[] = [];
        for (const el of allResultsRating) {
            const resultText: string = await el.innerText();
            const extractRating: string = resultText.split(' ')[0];
            allResultsRatingText.push(extractRating);
        }

        return allResultsRatingText;
    };

    async selectHighestRatedListing(): Promise<void> {
        const ratingList: string[] = await this.getRatingMap();
        const highestRated: number = Math.max(...ratingList.map(Number));
        console.log(`The highest rated is ${highestRated}`);
        await this.page.waitForTimeout(2 * 1000);
        await this.getCardByRated(highestRated).first().scrollIntoViewIfNeeded();
        await this.getCardByRated(highestRated).first().waitFor({ state: 'visible' });
        await this.getCardByRated(highestRated).first().click({ force: true });
    }
}
