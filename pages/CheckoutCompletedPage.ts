import { Locator, Page, expect } from "@playwright/test";
import { InventoryPage } from "./InventoryPage";

export class CheckoutCompletedPage{
    readonly page: Page
    readonly successImg: Locator
    readonly header: Locator
    readonly message: Locator
    readonly backHomeButton: Locator

    
    constructor(page: Page){
        this.page = page
        this.successImg = this.page.getByAltText("Pony Express")
        this.header = this.page.getByRole("heading", {name: "Thank you"})
        this.message = this.page.locator("div[data-test='complete-text']")
        this.backHomeButton = this.page.getByRole("button", {name: "Back Home"})
    }

    async check_success_image(){
        expect(this.successImg).toBeVisible()
    }

    async get_header_text(){
        const msg = await this.header.textContent() as string
        return msg
    }

    async get_success_message(){
        const txt = await this.message.textContent() as string
        return txt
    }

    async back_to_home(): Promise<InventoryPage>{
        await this.backHomeButton.click()
        expect(this.page.url()).toContain("/inventory")
        return new InventoryPage(this.page)
    }
}