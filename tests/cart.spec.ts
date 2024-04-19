import { test, expect } from "../fixtures/test"
import { InventoryPage } from "../pages/InventoryPage"
import { LoginPage } from "../pages/LoginPage"
import { Header } from "../pages/Header"
import { CartItem, CartPage } from "../pages/CartPage"

test.describe("Test Cart functions", async()=>{
    let loginPage: LoginPage
    let inventoryPage: InventoryPage
    let header: Header
    let cartPage: CartPage

    test.beforeEach(async({page})=>{
        loginPage = new LoginPage(page)
        inventoryPage = new InventoryPage(page)
        cartPage = new CartPage(page)
        header = new Header(page)

        const username = "standard_user"
        const password = "secret_sauce"
        await loginPage.goto()
        await loginPage.login(username, password)
        await loginPage.check_login_successful()
        
    })

    test("Test Product added to cart successfully", async({page, resource})=>{
        const product : CartItem = resource.products[0] as CartItem

        await test.step("Add product from inventory", async () => {
            await inventoryPage.add_product_to_cart(product.name)
        })

        await test.step("Check added product matches the existing cart item", async()=>{
           await header.navigate_to_cart()
           const cart_item =  await cartPage.get_cart_item(product)
           expect(cart_item.price).toEqual(product.price)
           expect(cart_item.qty).toEqual(product.qty)
        })
    })

    test("Test product removal in cart reflects in inventory", async({page, resource})=>{
        const product_1 : CartItem = resource.products[0] as CartItem


        const product_2 : CartItem = resource.products[1] as CartItem

        await test.step("Add products from inventory", async () => {
            await inventoryPage.add_product_to_cart(product_1.name)
            await inventoryPage.add_product_to_cart(product_2.name)

        })

        await test.step("Check products exist in cart", async()=>{
           await header.navigate_to_cart()
           const product1_exists =  await cartPage.cart_item_exists(product_1.name)
           const product2_exists =  await cartPage.cart_item_exists(product_2.name)
           expect(product1_exists).toBeTruthy()
           expect(product2_exists).toBeTruthy()

        })
        
        await test.step("Remove one product from cart", async()=>{
            await cartPage.remove_Cart_item(product_1.name)
            const product1_exists =  await cartPage.cart_item_exists(product_1.name)
            expect(product1_exists).toBeFalsy()
 
         })

         await test.step("Check product can be added again from inventory", async()=>{
            await cartPage.continue_shopping()
            const canBeAdded = await inventoryPage.canBeAddedToCart(product_1.name)
            expect(canBeAdded).toBeTruthy()
         })
        

    })
})