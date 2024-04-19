import { Locator, Page, expect } from "@playwright/test";
import { CheckoutSummary } from "./CheckoutSummary";
import { CartPage } from "./CartPage";

export class CheckoutInfo{
    readonly page: Page
    readonly firstName: Locator
    readonly lastName: Locator
    readonly zip: Locator
    readonly continue: Locator
    readonly error: Locator
    readonly cancelButton: Locator

    constructor(page: Page){
        this.page = page
        this.firstName = this.page.getByPlaceholder("First Name")
        this.lastName = this.page.getByPlaceholder("Last Name")
        this.zip = this.page.getByPlaceholder("Zip/Postal Code")
        this.continue = this.page.getByRole("button", {name: "Continue"})
        this.error = this.page.locator("css=h3[data-test='error']")
        this.cancelButton = this.page.getByRole("button", {name: "Cancel"})
    }

    async enter_firstName(firstName: string){
        await this.firstName.fill(firstName)
    }

    async enter_lastName(lastName: string){
        await this.lastName.fill(lastName)
    }

    async enter_zip(zip: string){
        await this.zip.fill(zip)
    }

    async enter_personal_info(firstName: string, lastName: string, zip: string): Promise<CheckoutInfo>{
        await this.enter_firstName(firstName)
        await this.enter_lastName(lastName)
        await this.enter_zip(zip)
        return this

    }

    async to_summary(): Promise<CheckoutSummary>{
        await this.continue.click()
        return new CheckoutSummary(this.page)
    }

    async throws_error(expected_error: string): Promise<CheckoutInfo>{
        expect(this.error).toBeVisible()
        expect(this.error).toHaveText(expected_error)
        return this
    }
    
    async cancel(): Promise<CartPage>{
        await this.cancelButton.click()
        expect(this.page.url()).toContain("/cart.html")
        return new CartPage(this.page)
    }
}