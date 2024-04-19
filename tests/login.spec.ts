import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

let loginPage: LoginPage

test.describe('login', async () => {

  test.beforeEach(async ({page})=> {
    loginPage = new LoginPage(page)
    await loginPage.goto();
    
  })

  test("test valid credentials", async ({page})=>{
    const username = "standard_user"
    const password = "secret_sauce"

   await test.step("Enter login credentials", async()=>{
      await loginPage.login(username, password)
    })

    await test.step("Check login was successful", async()=>{
      await loginPage.check_login_successful()

    })
  })

  test("test invalid credentials", async ({page})=>{
    const username = "standard_user"
    const password = "wrong"
    const expected_error = "Epic sadface: Username and password do not match any user in this service"

    await test.step("Enter login credentials", async()=>{
      await loginPage.login(username, password)
    })

    await test.step("Check displayed error message", async()=>{
      await loginPage.check_error(expected_error)

    })

  })

  test("test locked out user", async ({page})=>{
    const username = "locked_out_user"
    const password = "secret_sauce"
    const expected_error = "Epic sadface: Sorry, this user has been locked out."
    await test.step("Enter login credentials", async()=>{
      await loginPage.login(username, password)
    })

    await test.step("Check displayed error message", async()=>{
      await loginPage.check_error(expected_error)

    })
  })

});
