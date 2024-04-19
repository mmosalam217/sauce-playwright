import { Locator, Page, expect } from "@playwright/test";
import { Header } from "./Header";

export class InventoryPage{
    readonly page: Page
    readonly title: Locator
    readonly productsSort: Locator
    readonly header: Header
    readonly productsList: Locator
    readonly products: Locator

    constructor(page: Page){
        this.page = page
        this.title = page.locator("span.title")
        this.productsSort = page.locator("css=select[data-test='product-sort-container']")
        this.productsList = page.locator("div[data-test='inventory-list']")
        this.products = page.locator(".inventory_item")
        this.header = new Header(this.page)
        

    }

    async check_page_displayed(){
        expect(await this.title.textContent()).toEqual("Products")
    }

    async get_products_names(){
       const all_products =  await this.products.all()
       const products_titles = all_products.map(async p => await p.locator("xpath=//div[@class='inventory_item_label']/a").textContent())
       return products_titles
    }

    async get_products_prices(){
        const all_products =  await this.products.all()
        const products_prices = all_products.map(async p => {
            const price = await p.locator("xpath=//div[@class='inventory_item_price']").textContent() as string
            return Number(price.slice(1))
        })
        return products_prices
    }

    async sort_products(criteria: string){
        /**
         * A to Z = "az"
         * Z to A = "za"
         * High to low = "hilo"
         * Low to high = "lohi"
         */
        await this.productsSort.selectOption({value: criteria})
    }

    async add_product_to_cart(name: string){
        const product = this.products.filter({hasText: name})
        const addButton = product.getByRole("button", {name: "Add to cart"})
        await addButton.click()
    }

    async remove_product_from_cart(name: string){
        const product = this.products.filter({hasText: name})
        const removeButton = product.getByRole("button", {name: "Remove"})
        await removeButton.click()
    }

    async canBeAddedToCart(product_name: string){
        const product = this.products.filter({hasText: product_name})
        const addButton = product.getByRole("button", {name: "Add to cart"})
        const canBeAdded = await addButton.isVisible()
        return canBeAdded
    }
}