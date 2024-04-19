import { Page, Locator, expect } from '@playwright/test'

export class LoginPage {
    readonly page: Page
    readonly username: Locator
    readonly password: Locator
    readonly loginButton: Locator
    readonly error: Locator

    constructor(page: Page){
        this.page = page
        this.username = page.locator("#user-name")
        this.password = page.locator("#password")
        this.loginButton = page.locator("css=input[name='login-button']")
        this.error = page.locator("css=h3[data-test='error']")
    }

    async goto(): Promise<LoginPage>{
       await this.page.goto("https://www.saucedemo.com/")
       return this
    }

    async login(username: string, password: string): Promise<LoginPage>{
        await this.username.fill(username)
        await this.password.fill(password)
        await this.loginButton.click()
        return this
    }

    async check_login_successful(): Promise<LoginPage>{
        expect(this.page.url()).toContain("/inventory.html")
        return this
    }

    async check_error(message: string): Promise<LoginPage>{
        expect(this.error).toBeVisible()
        expect(await this.error.textContent()).toEqual(message)
        return this
    }
}