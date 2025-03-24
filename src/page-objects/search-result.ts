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
    readonly getCardByRated = (rated: string): Locator => this.page.getByText(`${rated} out of 5`);
    readonly nextPageButton = this.page.getByLabel('Search results pagination').getByLabel('Next', { exact: true });
    readonly prePageButton = this.page.getByLabel('Search results pagination').getByLabel('Previous', {exact: true});
    readonly getPageIndex = (index) => this.page.getByRole('link', { name: index.toString(), exact: true});
    readonly activePage = this.page.locator('[aria-label="Search results pagination"] [aria-current="page"]');

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

    async getActivePage(): Promise<number> {
        return parseInt(await this.activePage.innerText());
    }

    async selectPageByIndex(pageIndex: number): Promise<void> {
        let activePage: number = await this.getActivePage();

        while(!(pageIndex === activePage)) {
            if (await this.getPageIndex(pageIndex).isVisible()) {
                await this.getPageIndex(pageIndex).click();
                break;
            }

            if (activePage > pageIndex) {
                await this.prePageButton.click();
                activePage = await this.getActivePage();
            }

            if (activePage < pageIndex) {
                await this.nextPageButton.click();
                activePage = await this.getActivePage();
            }
        }

        return console.log(`Page index ${pageIndex} is selected`);
    }

    /**
     * Selects the listing with the highest rating and clicks on it.
     * @returns {Promise<void>} A promise that resolves when the action is completed.
     */
    async selectHighestRatedListing(): Promise<void> {
        let nextPageIsDisabled: boolean = await this.nextPageButton.isDisabled();
        let actualHighestRating = 0;
        let highestRatingPageIndex = 1;

        while (!nextPageIsDisabled) {
            const ratings: string[] = await this.getRatingMap();
            const highestRating: number = Math.max(...ratings.map(Number));
            if (actualHighestRating < highestRating) {
                actualHighestRating = highestRating;
                highestRatingPageIndex = parseInt(await this.activePage.innerText());
            }

            await this.nextPageButton.click();
            await this.page.waitForLoadState('domcontentloaded');
            nextPageIsDisabled = await this.nextPageButton.isDisabled();
        }

        console.log(`Highest rated listing: ${actualHighestRating.toFixed(1)} on page index ${highestRatingPageIndex}`);

        await this.selectPageByIndex(highestRatingPageIndex);
        await this.page.waitForTimeout(1000);
        const highestRatedCard = this.getCardByRated(actualHighestRating.toFixed(1)).first();
        await highestRatedCard.scrollIntoViewIfNeeded();
        await highestRatedCard.waitFor({ state: 'visible' });
        await highestRatedCard.click({ force: true });
    }
}
