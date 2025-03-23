import { Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';


export default class SearchResult extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Gets a card element based on the provided rating.
     * @param {number} rated - The rating to search for.
     * @returns {Locator} The locator for the matching rating element.
     */
    readonly getCardByRated = (rated: number): Locator => this.page.getByText(`${rated} out of 5`);

    /**
     * Retrieves all ratings displayed on the search results page.
     * @returns {Promise<string[]>} A promise that resolves with an array of rating values as strings.
     */
    async getRatingMap(): Promise<string[]> {
        await this.page.waitForTimeout(1000);
        const ratingElements: Locator[] = await this.page.getByText('out of 5').all();

        return Promise.all(
            ratingElements.map(async (el: Locator): Promise<string> => (await el.innerText()).split(' ')[0])
        );
    }

    /**
     * Selects the listing with the highest rating and clicks on it.
     * @returns {Promise<void>} A promise that resolves when the action is completed.
     */
    async selectHighestRatedListing(): Promise<void> {
        const ratings: string[] = await this.getRatingMap();
        const highestRating: number = Math.max(...ratings.map(Number));
        console.log(`Highest rated listing: ${highestRating}`);

        const highestRatedCard = this.getCardByRated(highestRating).first();

        await highestRatedCard.scrollIntoViewIfNeeded();
        await highestRatedCard.waitFor({ state: 'visible' });
        await highestRatedCard.click({ force: true });
    }
}
