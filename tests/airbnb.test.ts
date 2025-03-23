import { expect, Page, test } from '@playwright/test';
import dayjs, { Dayjs } from 'dayjs';

import HomePage from '@/page-objects/home-page';
import Rooms from '@/page-objects/rooms';
import SearchBar from '@/page-objects/search-bar';
import SearchResult from '@/page-objects/search-result';

let homePage: HomePage;
let searchBar: SearchBar;
let searchResults: SearchResult;
let rooms: Rooms;

const expectedDestinations = 'Amsterdam';
const currentDate: Dayjs = dayjs();
const nextWeekCheckOutDate: string = dayjs(currentDate).add(1, 'day').format('MM/DD/YYYY');

const adultsAmount: number = 2;
const childrenAmount: number = 1;

let checkInDate: string = currentDate.format('YYYY-MM-DD');
let checkOutDate: string = dayjs(currentDate).add(1, 'day').format('YYYY-MM-DD');

test.describe('Airbnb', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        searchBar = new SearchBar(page);
        searchResults = new SearchResult(page);
    });

    test('Airbnb booking flow validation', async ({ context }) => {
        await homePage.openHomePage();

        await searchBar.searchAndSelectDestination(expectedDestinations);
        await searchBar.selectCheckInAndCheckOutDates(checkInDate, checkOutDate);
        await searchBar.setAdultsAndChildrenGuests(adultsAmount, childrenAmount);
        await searchBar.clickOnSearchButton();

        const expectedSelectedDate = `${dayjs(checkInDate).format('MMM D')} – ${dayjs(checkOutDate).format('D')}`;
        const totalGuests = adultsAmount + childrenAmount;

        await expect(searchBar.searchLocationButton).toHaveText(expectedDestinations);
        await expect(searchBar.searchAnyTimeButton).toHaveText(expectedSelectedDate);
        await expect(searchBar.searchGuestsButton).toHaveText(`${totalGuests} guests`);

        const newPagePromise = context.waitForEvent('page');
        await searchResults.selectHighestRatedListing();
        const roomsPage: Page = await newPagePromise;
        await roomsPage.waitForLoadState();
        rooms = new Rooms(roomsPage);

        await rooms.closeTranslationOnPopup();

        checkInDate = dayjs(currentDate).format('M/DD/YYYY');
        checkOutDate = dayjs(checkOutDate).format('M/DD/YYYY');

        await expect(rooms.checkInDate).toHaveText(checkInDate);
        await expect(rooms.checkOutDate).toHaveText(checkOutDate);
        await expect(rooms.guestsPicker).toHaveText(`${totalGuests} guests`);

        await rooms.guestsPicker.click();
        await rooms.decreaseAmountChildrenGuests(childrenAmount);
        await expect(rooms.guestsPicker).toHaveText(`${totalGuests - childrenAmount} guests`);

        checkInDate = dayjs(checkInDate).format('MM/DD/YYYY');
        await rooms.setNewDatesIfNotBlocked(checkInDate, nextWeekCheckOutDate);
    });
});
