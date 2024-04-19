import { Page, Locator, expect } from "@playwright/test";
import { CheckoutPage } from "./CheckoutPage";
import { InventoryPage } from "./InventoryPage";
import { Header } from "./Header";

export type CartItem = {
    name: string,
    price: number,
    qty: number
}

export class CartPage{

    readonly page: Page
    readonly header: Header
    readonly items: Locator
    readonly checkoutButton: Locator
    readonly continueShoppingButton: Locator

    constructor(page: Page){
        this.page = page
        this.header = new Header(this.page)
        this.items = page.locator(".cart_item")
        this.checkoutButton = this.page.getByRole("button", {name: "Checkout"})
        this.continueShoppingButton = this.page.getByRole("button", {name: "Continue Shopping"})
    }

    async goto(){
        await this.header.navigate_to_cart()
    }

    async checkout(): Promise<CheckoutPage>{
        await this.checkoutButton.click()
        return new CheckoutPage(this.page)
    }

    async continue_shopping(): Promise<InventoryPage>{
        await this.continueShoppingButton.click()
        return new InventoryPage(this.page)
    }

    async cart_item_exists(item_name: string): Promise<boolean>{
        const cart_item = this.items.filter({hasText: item_name})
        const exists = await cart_item.isVisible()
        return exists
    }

    async get_cart_item(item: CartItem): Promise<CartItem>{
        const cart_item = this.items.filter({hasText: item.name})
        expect(cart_item).toBeVisible()
        const item_price = cart_item.locator("css=div[data-test='inventory-item-price']")
        let normalized_price = await item_price.textContent() as string
        normalized_price = normalized_price.trim().split("").slice(1).join("")
        let qty = cart_item.locator("css=div[data-test='item-quantity']")
        let actual_qty = await qty.textContent() as string
        return {name: item.name, price: Number(normalized_price), qty: Number(actual_qty)}
    }

    async compare_items(items: CartItem[]): Promise<boolean>{
        let passed: boolean = true
        for (let expected_item of items){
            const actual_item = await this.get_cart_item(expected_item)
            try{
                expect(actual_item.price).toEqual(expected_item.price)
                expect(actual_item.qty).toEqual(expected_item.qty)
            }catch(e){
                passed = false
            }
        }
        return passed
    }

    async remove_Cart_item(item_name: string){
        const cart_item = this.items.filter({hasText: item_name})
        const remove_button = cart_item.getByRole("button", {name: "Remove"})
        await remove_button.click()
    }
}