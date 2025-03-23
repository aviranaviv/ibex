import { expect, Page, test } from '@playwright/test';
import dayjs from 'dayjs';

import HomePage from '@/page-objects/home-page';
import Rooms from '@/page-objects/rooms';
import SearchBar from '@/page-objects/search-bar';
import SearchResult from '@/page-objects/search-result';

let homePage: HomePage;
let searchBar: SearchBar;
let searchResults: SearchResult;
let rooms: Rooms;

const expectedDestinations = 'Amsterdam';
const dateFormat: string = 'YYYY-MM-DD';
const currentDate: string = dayjs().format(dateFormat);
const tomorrowDate: string = dayjs().add(1, 'day').format(dateFormat);
const adultsAmount: number = 2;
const childrenAmount: number = 1;

test.describe('Airbnb', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchBar = new SearchBar(page);
        searchResults = new SearchResult(page);
    });

    test('Airbnb booking flow validation', async ({ context }) => {
        await homePage.openHomePage();
        await searchBar.searchAndSelectDestination(expectedDestinations);
        await searchBar.selectCheckInAndCheckOutDates(currentDate, tomorrowDate);
        await searchBar.setAdultsAndChildrenGuests(adultsAmount, childrenAmount);
        await searchBar.clickOnSearchButton();

        const expectedSelectedDate = `${dayjs(currentDate).format('MMM D')} – ${dayjs(tomorrowDate).format('D')}`;
        const totalGuests = adultsAmount + childrenAmount;

        await expect(searchBar.searchLocationButton).toHaveText(expectedDestinations);
        await expect(searchBar.searchAnyTimeButton).toHaveText(expectedSelectedDate);
        await expect(searchBar.searchGuestsButton).toHaveText(`${totalGuests} guests`);

        const newPagePromise = context.waitForEvent('page');
        await searchResults.selectHighestRatedListing();
        const roomsPage: Page = await newPagePromise;
        await roomsPage.waitForLoadState();
        rooms = new Rooms(roomsPage);

        const newCurrentDateFormat: string = dayjs(currentDate).format('M/DD/YYYY');
        const newTomorrowDateFormat: string = dayjs(tomorrowDate).format('M/DD/YYYY');

        await rooms.closeTranslationOnPopup();

        await expect(rooms.checkInDate).toHaveText(newCurrentDateFormat);
        await expect(rooms.checkOutDate).toHaveText(newTomorrowDateFormat);
        await expect(rooms.guestsPicker).toHaveText(`${totalGuests} guests`);

        await rooms.guestsPicker.click();
        await rooms.decreaseAmountChildrenGuests(childrenAmount);
        await expect(rooms.guestsPicker).toHaveText(`${totalGuests - childrenAmount} guests`);

        const nextWeekDate = dayjs().add(1, 'week').format('MM/DD/YYYY');
        const currentDateNewFormat = dayjs(currentDate).format('MM/DD/YYYY');

        await rooms.setNewDatesIfNotBlocked(currentDateNewFormat, nextWeekDate);
    });
});
