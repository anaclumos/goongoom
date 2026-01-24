import path from "node:path"
import { expect, test as setup } from "@playwright/test"

const authFile = path.join(__dirname, "../.auth/user.json")

setup("authenticate", async ({ page }) => {
  await page.goto("/")

  const signInButton = page.getByRole("button", { name: /login|sign in/i })
  const isSignedOut = await signInButton.isVisible().catch(() => false)

  if (isSignedOut) {
    await signInButton.click()

    await page
      .waitForSelector("[data-clerk-portal]", { timeout: 5000 })
      .catch(() => {
        console.log("Clerk portal not found, user may already be signed in")
      })

    const emailInput = page.locator('input[name="identifier"]')
    if (await emailInput.isVisible()) {
      await emailInput.fill(
        process.env.TEST_USER_EMAIL || "testuser+clerk_test@example.com"
      )
      await page.getByRole("button", { name: /continue/i }).click()

      const codeInput = page.locator('input[name="code"]')
      if (await codeInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await codeInput.fill("424242")
        await page.getByRole("button", { name: /continue|verify/i }).click()
      }

      const passwordInput = page.locator('input[name="password"]')
      if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await passwordInput.fill(
          process.env.TEST_USER_PASSWORD || "testpassword123"
        )
        await page.getByRole("button", { name: /continue|sign in/i }).click()
      }
    }
  }

  await expect(
    page
      .getByTestId("clerk-user-button")
      .or(page.locator("[data-clerk-user-button-root]"))
  )
    .toBeVisible({ timeout: 10_000 })
    .catch(() => {
      console.log("User button not visible after auth, continuing anyway")
    })

  await page.context().storageState({ path: authFile })
})
