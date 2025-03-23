import { expect, Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class SearchBar extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    readonly searchDestinationsInput: Locator = this.page.getByTestId('structured-search-input-field-query');
    readonly searchListContainer: Locator = this.page.getByTestId('structured-search-input-field-query-panel');
    readonly firstSuggestionsOption: Locator = this.page.getByTestId('option-0');
    readonly checkInTab: Locator = this.page.getByTestId('structured-search-input-field-split-dates-0');
    readonly checkOutTab: Locator = this.page.getByTestId('structured-search-input-field-split-dates-1');
    readonly getDate: (date: string) => Locator = (date: string): Locator =>  this.page.locator(`[data-state--date-string="${date}"]`);
    readonly addGuestsButton: Locator = this.page.getByTestId('structured-search-input-field-guests-button');
    readonly increaseAdultsGuestsButton: Locator = this.page.getByTestId('stepper-adults-increase-button');
    readonly increaseChildrenGuestsButton: Locator = this.page.getByTestId('stepper-children-increase-button');
    readonly addGuestsPanel: Locator = this.page.getByTestId('structured-search-input-field-guests-panel');
    readonly searchButton: Locator = this.page.getByTestId('structured-search-input-search-button');
    readonly searchLocationButton: Locator = this.page.getByTestId('little-search-location').locator('div');
    readonly searchAnyTimeButton: Locator = this.page.getByTestId('little-search-anytime').locator('div');
    readonly searchGuestsButton: Locator = this.page.getByTestId('little-search-guests').locator('div').nth(0);

    async searchAndSelectDestinations(name: string): Promise<void> {
        await this.searchDestinationsInput.fill(name);
        await this.searchListContainer.isVisible();
        await this.firstSuggestionsOption.click();
    }

    async setCheckInDate(checkInDate: string) {
        await expect(this.checkInTab).toHaveAttribute('aria-expanded', 'true');
        await this.getDate(checkInDate).click();
    }

    async setCheckOutDate(checkOutDate: string) {
        await expect(this.checkOutTab).toHaveAttribute('aria-expanded', 'true');
        await this.getDate(checkOutDate).click();
    }

    async selectCheckInAndCheckOutDates(checkInDate: string, checkOutDate: string): Promise<void>{
        await this.setCheckInDate(checkInDate);
        await this.setCheckOutDate(checkOutDate);
    }

    async increaseAmountOfAdultsGuests(amount: number){
        for (let i: number = 0; i < amount; i++) {
            await this.increaseAdultsGuestsButton.click();
        }
    }

    async increaseAmountOfChildrenGuests(amount: number){
        for (let i: number = 0; i < amount; i++) {
            await this.increaseChildrenGuestsButton.click();
        }
    }

    async setAdultsAndChildrenGuests(adultsAmount: number, childrenAmount: number){
        await this.addGuestsButton.click();
        await expect(this.addGuestsButton).toHaveAttribute('aria-expanded', 'true');
        await this.addGuestsPanel.isVisible();
        await this.increaseAmountOfAdultsGuests(adultsAmount);
        await this.increaseAmountOfChildrenGuests(childrenAmount);
    }

    async clickOnSearchButton() {
        await this.searchButton.click();
    }
}
