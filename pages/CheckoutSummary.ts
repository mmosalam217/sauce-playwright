import { Locator, Page, expect } from "@playwright/test";
import { InventoryPage } from "./InventoryPage"
import { CheckoutCompletedPage } from "./CheckoutCompletedPage";

export class CheckoutSummary{
    readonly page: Page
    readonly finishButton: Locator
    readonly cancelButton: Locator
    readonly products: Locator
    readonly paymentInfo: Locator
    readonly shippingInfo: Locator
    readonly subTotal: Locator
    readonly tax: Locator
    readonly priceTotal: Locator
    
    constructor(page: Page){
        this.page = page
        this.finishButton = this.page.getByRole("button", {name: "Finish"})
        this.cancelButton = this.page.getByRole("button", {name: "Cancel"})
        this.products = this.page.locator(".cart_item")
        this.paymentInfo = this.page.locator("div[data-test='payment-info-value']")
        this.shippingInfo = this.page.locator("div[data-test='shipping-info-value']")
        this.subTotal = this.page.locator("div[data-test='subtotal-label']")
        this.tax = this.page.locator("div[data-test='tax-label']")
        this.priceTotal = this.page.locator("div[data-test='total-label']")


    }

    async cancel(): Promise<InventoryPage>{
        await this.cancelButton.click()
        expect(this.page.url()).toContain("/inventory.html")
        return new InventoryPage(this.page)

    }
    async finish(): Promise<CheckoutCompletedPage>{
        await this.finishButton.click()
        expect(this.page.url()).toContain("/checkout-complete.html")
        return new CheckoutCompletedPage(this.page)

    }
    async get_payment_info(): Promise<string>{
        const info = await this.paymentInfo.textContent() as string //SauceCard #31337
        return info
    }

    async get_shipping_info(): Promise<string>{
        const info = await this.shippingInfo.textContent() as string //Free Pony Express Delivery!
        return info
    }

    async get_subtotal(): Promise<Number>{
        const subtotal = await this.subTotal.textContent() as string
        return this.extract_price(subtotal)

    }

    async get_tax(): Promise<Number>{
        const tax_text = await this.tax.textContent() as string
        return this.extract_price(tax_text)
    }

    async calculate_tax(subtotal: number): Promise<number>{
        const percentage = 0.08
        const calculated = (Math.round((((subtotal * percentage) + Number.EPSILON) * 100)) / 100).toFixed(2)
        return parseFloat(calculated)
    }

    async get_total_price(): Promise<Number>{
        const subtotal = await this.priceTotal.textContent() as string
        return this.extract_price(subtotal)

    }

    extract_price(raw_price: string): Number{
        const price_with_currency = raw_price.split(" ").pop() as string
        const price_without_currency = price_with_currency.slice(1)
        return Number(price_without_currency)
    }
}