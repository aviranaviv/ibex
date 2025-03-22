import { expect, test } from '@playwright/test';
import dayjs from 'dayjs';

import AirbnbHomePage from '@/page-objects/airbnb-home-page';
import SearchBar from '@/page-objects/search-bar';
import SearchResult from '@/page-objects/search-result';

let homePage: AirbnbHomePage;
let searchBar: SearchBar;
let searchResults: SearchResult;

const expectedDestinations = 'Amsterdam';
const dateFormat: string = 'YYYY-MM-DD';
const currentDate: string = dayjs().format(dateFormat);
const tomorrowDate: string = dayjs().add(1, 'day').format(dateFormat);
const adultsAmount: number = 2;
const childrenAmount: number = 1;

test.describe('Airbnb', () => {
    test.beforeEach(async ({ page }) => {
        homePage = new AirbnbHomePage(page);
        searchBar = new SearchBar(page);
        searchResults = new SearchResult(page);
    });

    test('Airbnb booking flow validation', async ({ page }) => {
        await homePage.openHomePage();
        await searchBar.searchAndSelectDestinations(expectedDestinations);
        await searchBar.selectCheckInAndCheckOutDates(currentDate, tomorrowDate);
        await searchBar.setAdultsAndChildrenGuests(adultsAmount, childrenAmount);
        await searchBar.clickOnSearchButton();

        const expectedSelectedDate = `${dayjs(currentDate).format('MMM D')} – ${dayjs(tomorrowDate).format('D')}`;
        const totalGuests = adultsAmount + childrenAmount;

        await expect(searchBar.searchLocationButton).toHaveText(expectedDestinations);
        await expect(searchBar.searchAnyTimeButton).toHaveText(expectedSelectedDate);
        await expect(searchBar.searchGuestsButton).toHaveText(`${totalGuests} guests`);

        await page.pause();
        await searchResults.getRatingMap();
    });
});
