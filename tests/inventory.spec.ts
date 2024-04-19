import { test, expect } from "../fixtures/test"
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { Header } from "../pages/Header";

test.describe("Test inventory functions", async()=>{
    let loginPage: LoginPage
    let inventoryPage: InventoryPage
    let header: Header

    test.beforeEach(async({page})=>{
        loginPage = new LoginPage(page)
        inventoryPage = new InventoryPage(page)
        header = new Header(page)
        const username = "standard_user"
        const password = "secret_sauce"
        await loginPage.goto()
        await loginPage.login(username, password)
        await loginPage.check_login_successful()

    })

    test("check sort from A to Z", async()=>{
        const expected = (await inventoryPage.get_products_names()).sort()
        await inventoryPage.sort_products("az")
        const actual = await inventoryPage.get_products_names()
        expect(expected).toEqual(actual)
    })

    test("check sort from Z to A", async()=>{
        const expected = (await inventoryPage.get_products_names()).sort().reverse()
        await inventoryPage.sort_products("za")
        const actual = await inventoryPage.get_products_names()
        expect(expected).toEqual(actual)
    })

    
    test("check sort from highest to lowest price", async()=>{
        const expected = (await inventoryPage.get_products_prices()).sort()
        await inventoryPage.sort_products("hilo")
        const actual = await inventoryPage.get_products_prices()
        expect(expected).toEqual(actual)
    })

        
    test("check sort from lowest to highest price", async()=>{
        const expected = (await inventoryPage.get_products_prices()).sort().reverse()
        await inventoryPage.sort_products("lohi")
        const actual = await inventoryPage.get_products_prices()
        expect(expected).toEqual(actual)
    })

    test("Test add product to cart", async()=>{
        const product_name = "Sauce Labs Backpack"
        const current_products_count = await header.count_cart_products()
        await inventoryPage.add_product_to_cart(product_name)
        const new_count  = await header.count_cart_products()
        expect(new_count).toEqual(current_products_count + 1)
        
    })

    test("Test remove product to cart", async()=>{
        const product_1 = "Sauce Labs Backpack"
        const product_2 = "Sauce Labs Fleece Jacket"
        const current_products_count = await header.count_cart_products()
        await inventoryPage.add_product_to_cart(product_1)
        await inventoryPage.add_product_to_cart(product_2)
        const new_count  = await header.count_cart_products()
        expect(new_count).toEqual(current_products_count + 2)
        await inventoryPage.remove_product_from_cart(product_1)
        expect(await header.count_cart_products()).toEqual(new_count - 1)

    })
})
