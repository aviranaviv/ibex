import { expect, Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class SearchBar extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    readonly searchDestinationsInput: Locator = this.page.getByTestId('structured-search-input-field-query');
    readonly firstSuggestionsOption: Locator = this.page.getByTestId('option-0');

    readonly checkInTab: Locator = this.page.getByTestId('structured-search-input-field-split-dates-0');
    readonly checkOutTab: Locator = this.page.getByTestId('structured-search-input-field-split-dates-1');

    readonly addGuestsButton: Locator = this.page.getByTestId('structured-search-input-field-guests-button');
    readonly increaseAdultsGuestsButton: Locator = this.page.getByTestId('stepper-adults-increase-button');
    readonly increaseChildrenGuestsButton: Locator = this.page.getByTestId('stepper-children-increase-button');

    readonly searchButton: Locator = this.page.getByTestId('structured-search-input-search-button');
    readonly searchLocationButton: Locator = this.page.getByTestId('little-search-location').locator('div');
    readonly searchAnyTimeButton: Locator = this.page.getByTestId('little-search-anytime').locator('div');
    readonly searchGuestsButton: Locator = this.page.getByTestId('little-search-guests').locator('div').nth(0);

    /**
     * Gets a specific date element based on the provided date string.
     * @param {string} date - The date to locate in the format expected by the data attribute.
     * @returns {Locator} The locator for the matching date element.
     */
    readonly getSpecificDate = (date: string): Locator => this.page.locator(`[data-state--date-string="${date}"]`);

    /**
     * Searches and selects the first suggested destination.
     * @param {string} name - Destination name to search.
     * @returns {Promise<void>}
     */
    async searchAndSelectDestination(name: string): Promise<void> {
        await this.searchDestinationsInput.fill(name);
        await this.firstSuggestionsOption.click();
    }

    /**
     * Selects a check-in date.
     * @param {string} checkInDate - Check-in date.
     * @returns {Promise<void>}
     */
    async setCheckInDate(checkInDate: string): Promise<void> {
        await expect(this.checkInTab).toHaveAttribute('aria-expanded', 'true');
        await this.getSpecificDate(checkInDate).click();
    }

    /**
     * Selects a check-out date.
     * @param {string} checkOutDate - Check-out date.
     * @returns {Promise<void>}
     */
    async setCheckOutDate(checkOutDate: string): Promise<void> {
        await expect(this.checkOutTab).toHaveAttribute('aria-expanded', 'true');
        await this.getSpecificDate(checkOutDate).click();
    }

    /**
     * Sets both check-in and check-out dates.
     * @param {string} checkInDate - Check-in date.
     * @param {string} checkOutDate - Check-out date.
     * @returns {Promise<void>}
     */
    async selectCheckInAndCheckOutDates(checkInDate: string, checkOutDate: string): Promise<void> {
        await this.setCheckInDate(checkInDate);
        await this.setCheckOutDate(checkOutDate);
    }

    /**
     * Increases the number of adult guests.
     * @param {number} amount - Number of times to increase.
     * @returns {Promise<void>}
     */
    async increaseAdultsGuests(amount: number): Promise<void> {
        for (let i = 0; i < amount; i++) {
            await this.increaseAdultsGuestsButton.click();
        }
    }

    /**
     * Increases the number of children guests.
     * @param {number} amount - Number of times to increase.
     * @returns {Promise<void>}
     */
    async increaseChildrenGuests(amount: number): Promise<void> {
        for (let i = 0; i < amount; i++) {
            await this.increaseChildrenGuestsButton.click();
        }
    }

    /**
     * Sets the number of adult and child guests.
     * @param {number} adults - Number of adult guests.
     * @param {number} children - Number of child guests.
     * @returns {Promise<void>}
     */
    async setAdultsAndChildrenGuests(adults: number, children: number): Promise<void> {
        await this.addGuestsButton.click();
        await expect(this.addGuestsButton).toHaveAttribute('aria-expanded', 'true');

        await this.increaseAdultsGuests(adults);
        await this.increaseChildrenGuests(children);
    }

    /**
     * Clicks on the search button.
     * @returns {Promise<void>}
     */
    async clickOnSearchButton(): Promise<void> {
        await this.searchButton.click();
    }
}
