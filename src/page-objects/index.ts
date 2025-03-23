import { type Page } from '@playwright/test';

export default class PageObjects {
    /**
     * @protected
     * @param {Page} page - page element.
     */
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}
