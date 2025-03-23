import { Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class Rooms extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    // Locators
    readonly translationModal: Locator = this.page.getByTestId('translation-announce-modal');

    readonly checkInDate: Locator = this.page.getByTestId('change-dates-checkIn');
    readonly checkOutDate: Locator = this.page.getByTestId('change-dates-checkOut');
    readonly getSpecificDate: (date: string) => Locator = (date: string): Locator =>  this.page.getByTestId(`calendar-day-${date}`);

    readonly guestsPicker: Locator = this.page.locator('#GuestPicker-book_it-trigger');
    readonly decreaseChildrenGuestsButton: Locator = this.page.getByTestId('GuestPicker-book_it-form-children-stepper-decrease-button');

    readonly reserveButton =  this.page.getByRole('button', { name: 'Reserve' });

    /**
     * Closes the translation popup if it appears.
     * If the popup is not found, it proceeds with execution.
     * Logs the status of the popup closure.
     * @returns {Promise<void>}
     */
    async closeTranslationOnPopup(): Promise<void> {
        try {
            if (await this.translationModal.isVisible()) {
                await this.page.getByLabel('Close').click();
                console.log('Translation popup closed successfully.');
            } else {
                console.log('Popup not found, continuing execution.');
            }
        } catch (error) {
            console.log('Error closing popup:', error);
        }
    }

    /**
     * Decreases the number of children guests by the specified amount.
     * @param {number} amount - Number of children guests to decrease
     * @returns {Promise<void>}
     */
    async decreaseAmountChildrenGuests(amount: number): Promise<void> {
        for (let i: number = 0; i < amount; i++) {
            await this.decreaseChildrenGuestsButton.click();
        }
    }

    /**
     * Checks if a specific date in the calendar is blocked.
     * @param {string} date - The date to check
     * @returns {Promise<boolean>} - `true` if the date is disabled, otherwise `false`
     */
    async checkIfDateIsBlocked(date: string): Promise<boolean> {
        return await this.getSpecificDate(date).isDisabled();
    }

    /**
     * Sets new check-in and check-out dates if they are not blocked.
     * If a date is blocked, it keeps the currently selected date and logs a message.
     * @param {string} checkInDate - The desired check-in date in `YYYY-MM-DD` format
     * @param {string} checkOutDate - The desired check-out date in `YYYY-MM-DD` format
     * @returns {Promise<void>}
     */
    async setNewDatesIfNotBlocked(checkInDate: string, checkOutDate: string): Promise<void> {
        if (await this.checkIfDateIsBlocked(checkInDate)) {
            return console.log(`Check-in date ${checkInDate} is blocked. Keeping the existing date.`);
        }

        await this.getSpecificDate(checkInDate).click();

        if (await this.checkIfDateIsBlocked(checkOutDate)) {
            return console.log(`Check-out date ${checkOutDate} is blocked. Keeping the existing date.`);
        }

        await this.getSpecificDate(checkOutDate).click();
    }
}
