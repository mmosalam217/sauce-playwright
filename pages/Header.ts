import { Page, Locator, expect } from "@playwright/test";
import { CartPage } from "./CartPage";

export class Header{
    readonly page: Page
    readonly menuIcon: Locator
    readonly menu: Locator
    readonly logoutButton: Locator
    readonly cartButton: Locator
    readonly productsInCartCount: Locator

    constructor(page: Page){
        this.page = page
        this.menuIcon = page.locator("#react-burger-menu-btn")
        this.menu = page.locator(".bm-menu")
        this.logoutButton = page.locator("#logout_sidebar_link")
        this.cartButton = page.locator("#shopping_cart_container")
        this.productsInCartCount = page.locator("css=a[data-test='shopping-cart-link']")
    }

    async logout(){
        await this.menuIcon.click()
        await this.menu.isVisible()
        this.logoutButton.click()
        expect(this.page.url()).toEqual("https://www.saucedemo.com/")
    }

    async navigate_to_cart(): Promise<CartPage>{
        await this.cartButton.click()
        return new CartPage(this.page)


    }

    async count_cart_products(){
        let count = await this.productsInCartCount.textContent() as string
        return count == ""? 0 :  parseInt(count.trim())
    }
}