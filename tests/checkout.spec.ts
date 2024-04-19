import { test, expect } from "../fixtures/test"
import { LoginPage } from "../pages/LoginPage"
import { InventoryPage } from "../pages/InventoryPage"
import { CartItem, CartPage } from "../pages/CartPage"
import { Header } from "../pages/Header"
import { CheckoutInfo } from "../pages/CheckoutInfo"
import { CheckoutSummary } from "../pages/CheckoutSummary"
import { CheckoutCompletedPage } from "../pages/CheckoutCompletedPage"


test.describe("Test checkout functions", async()=>{
    let loginPage: LoginPage
    let inventoryPage: InventoryPage
    let header: Header
    let cartPage: CartPage
    let checkoutInfo: CheckoutInfo
    let checkoutSummary: CheckoutSummary
    let checkoutCompletedPage: CheckoutCompletedPage

    test.beforeEach(async({page})=>{
        loginPage = new LoginPage(page)
        inventoryPage = new InventoryPage(page)
        cartPage = new CartPage(page)
        checkoutInfo = new CheckoutInfo(page)
        checkoutSummary = new CheckoutSummary(page)
        checkoutCompletedPage = new CheckoutCompletedPage(page)
        header = new Header(page)

        const username = "standard_user"
        const password = "secret_sauce"
        await loginPage.goto()
        await loginPage.login(username, password)
        await loginPage.check_login_successful()
    })

    test("Checkout person information form", async({page, resource})=>{
        const product : CartItem = resource.products[0] as CartItem

        await test.step("Add product from inventory", async () => {
            await inventoryPage.add_product_to_cart(product.name)
        })

        await test.step("Check added product and checkout", async()=>{
           await header.navigate_to_cart()
           expect(await cartPage.cart_item_exists(product.name)).toBeTruthy()
           await cartPage.checkout()

        })

        await test.step("Proceed without filling info", async()=>{
            const expected_error = "Error: First Name is required"
            await checkoutInfo.to_summary()
            await checkoutInfo.throws_error(expected_error)

        })

        await test.step("Proceed without firstname", async()=>{
            const expected_error = "Error: First Name is required"
            await checkoutInfo.enter_personal_info("", "Doe", "60332")
            await checkoutInfo.to_summary()
            await checkoutInfo.throws_error(expected_error)

        })

        await test.step("Proceed without lastname", async()=>{
            const expected_error = "Error: Last Name is required"
            await checkoutInfo.enter_personal_info("John", "", "60332")
            await checkoutInfo.to_summary()
            await checkoutInfo.throws_error(expected_error)

        })

        await test.step("Proceed without postal code", async()=>{
            const expected_error = "Error: Postal Code is required"
            await checkoutInfo.enter_personal_info("John", "Doe", "")
            await checkoutInfo.to_summary()
            await checkoutInfo.throws_error(expected_error)

        })
        await test.step("Proceed with filling info", async()=>{
            await checkoutInfo.enter_personal_info("John", "Doe", "60332")
            await checkoutInfo.to_summary()
            expect(page.url()).toContain("checkout-step-two.html")

        })
    })

    test("Checkout summary items", async({page})=>{
        const product1 : CartItem = {
            name: "Sauce Labs Backpack",
            price: 29.99,
            qty: 1
        }
        const product2 : CartItem = {
            name: "Sauce Labs Fleece Jacket",
            price: 49.99,
            qty: 1
        }
        await test.step("Add product from inventory", async () => {
            await inventoryPage.add_product_to_cart(product1.name)
            await inventoryPage.add_product_to_cart(product2.name)

        })

        await test.step("Proceed to checkout", async()=>{
           await header.navigate_to_cart()
           await cartPage.checkout()

        })

        await test.step("Proceed with filling info", async()=>{
            await checkoutInfo.enter_personal_info("John", "Doe", "60332")
            await checkoutInfo.to_summary()
            expect(page.url()).toContain("checkout-step-two.html")

        })

        await test.step("Check items on summary page", async()=>{
            // cartPage used as its the same webcomponent
            expect(await cartPage.cart_item_exists(product1.name)).toBeTruthy()
            expect(await cartPage.cart_item_exists(product2.name)).toBeTruthy()
 
         })
    })

    test("Checkout summary payment and shipping details", async({page, resource})=>{
        const product1 : CartItem = resource.products[0] as CartItem
        const product2 : CartItem = resource.products[1] as CartItem
        await test.step("Add product from inventory", async () => {
            await inventoryPage.add_product_to_cart(product1.name)
            await inventoryPage.add_product_to_cart(product2.name)

        })

        await test.step("Check added product and checkout", async()=>{
           await header.navigate_to_cart()
           expect(await cartPage.cart_item_exists(product1.name)).toBeTruthy()
           expect(await cartPage.cart_item_exists(product2.name)).toBeTruthy()
           await cartPage.checkout()

        })

        await test.step("Proceed with filling info", async()=>{
            await checkoutInfo.enter_personal_info("John", "Doe", "60332")
            await checkoutInfo.to_summary()
            expect(page.url()).toContain("checkout-step-two.html")

        })

        await test.step("Check summary details", async()=>{
            const expected_payment_info = "SauceCard #31337"
            const expected_shipping_info = "Free Pony Express Delivery!"
            const expected_subtotal = product1.price + product2.price
            const expected_tax = await checkoutSummary.calculate_tax(expected_subtotal)
            // to return only 2 decimal places as on the actual displayed number
            const expected_total = parseFloat((expected_subtotal + expected_tax).toFixed(2))

            await test.step("Check payment information", async()=>{
                const actual = await checkoutSummary.get_payment_info()
                expect(actual).toEqual(expected_payment_info)
            })

            await test.step("Check shipping information", async()=>{
                const actual = await checkoutSummary.get_shipping_info()
                expect(actual).toEqual(expected_shipping_info)
            })

            await test.step("Check subtotal", async()=>{
                const actual = await checkoutSummary.get_subtotal()
                expect(actual).toEqual(expected_subtotal)
            })

            await test.step("Check tax", async()=>{
                const actual = await checkoutSummary.get_tax()
                expect(actual).toEqual(expected_tax)
            })

            await test.step("Check total", async()=>{
                const actual = await checkoutSummary.get_total_price()
                expect(actual).toEqual(expected_total)
            })
        })
    })

    test("Checkout complete flow", async({page, resource})=>{
        const product1 : CartItem = resource.products[0] as CartItem

        await test.step("Add product from inventory", async () => {
            await inventoryPage.add_product_to_cart(product1.name)

        })

        await test.step("Check added product and checkout", async()=>{
           await header.navigate_to_cart()
           expect(await cartPage.cart_item_exists(product1.name)).toBeTruthy()
           await cartPage.checkout()

        })

        await test.step("Proceed with filling info", async()=>{
            await checkoutInfo.enter_personal_info("John", "Doe", "60332")
            await checkoutInfo.to_summary()
            expect(page.url()).toContain("checkout-step-two.html")

        })

        await test.step("Finish checkout and verify success", async()=>{
        
            await test.step("Confirm checkout", async()=>{
                await checkoutSummary.finish()
            })

            await test.step("verify compeletion page", async()=>{
                const expected_header = "Thank you for your order!"
                const expected_text = "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
                await checkoutCompletedPage.check_success_image()
                const actual_header = await checkoutCompletedPage.get_header_text()
                const actual_text = await checkoutCompletedPage.get_success_message()
                expect(expected_header).toEqual(actual_header)
                expect(expected_text).toEqual(actual_text)
            })

            await test.step("Verify cart is empty again", async()=>{
                await checkoutCompletedPage.back_to_home()
                const cart_count = await header.count_cart_products()
                expect(cart_count).toEqual(0)
            })

        })
    })
})