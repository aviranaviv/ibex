import { Locator, Page } from '@playwright/test';

import PageObjects from '@/page-objects/index';

export default class Rooms extends PageObjects {
    constructor(page: Page) {
        super(page);
    }

    readonly translationModal = this.page.getByTestId('translation-announce-modal');
    readonly checkInDate = this.page.getByTestId('change-dates-checkIn');
    readonly checkOutDate = this.page.getByTestId('change-dates-checkOut');
    readonly guestsPicker = this.page.locator('#GuestPicker-book_it-trigger');
    readonly decreaseChildrenGuestsButton: Locator = this.page.getByTestId('GuestPicker-book_it-form-children-stepper-decrease-button');
    readonly getDate: (date: string) => Locator = (date: string): Locator =>  this.page.getByTestId(`calendar-day-${date}`);

    async closeTranslationOnPopup(): Promise<void> {
        try {
            // Small wait to ensure the modal loads if it appears
            await this.page.waitForTimeout(1000);
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

    async decreaseAmountChildrenGuests(amount: number): Promise<void> {
        for (let i: number = 0; i < amount; i++) {
            await this.decreaseChildrenGuestsButton.click();
        }
    }

    async checkIfDateIsBlocked(date: string): Promise<boolean> {
        const attributeValue = this.getDate(date).locator('[data-is-day-blocked="true"]');
        // Returns true if the date is blocked, false otherwise
        return await attributeValue.isVisible();
    }

    async setNewDatesIfNotBlocked(checkInDate: string, checkOutDate: string): Promise<void> {
        const checkInIsBlocked: boolean = await this.checkIfDateIsBlocked(checkInDate);
        const checkOutIsBlocked: boolean = await this.checkIfDateIsBlocked(checkOutDate);

        if (checkInIsBlocked && checkOutIsBlocked) {
            return console.log('Dates are blocked, Keep the dated that are already selected');
        }

        await this.getDate(checkInDate).click();
        await this.getDate(checkOutDate).click();
    }
}
