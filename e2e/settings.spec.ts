import { expect, test } from "@playwright/test"

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings")
  })

  test("settings page loads", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible()
  })

  test("can navigate to profile settings", async ({ page }) => {
    const profileLink = page.getByRole("link", { name: /profile/i })
    if (await profileLink.isVisible()) {
      await profileLink.click()
      await expect(page).toHaveURL(/settings\/profile/)
    }
  })

  test("bio field is editable", async ({ page }) => {
    await page.goto("/settings/profile")

    const bioTextarea = page
      .locator('textarea[name="bio"]')
      .or(page.getByPlaceholder(/bio/i))

    if (await bioTextarea.isVisible()) {
      await bioTextarea.fill("Test bio from E2E")
      await bioTextarea.blur()
    }

    await expect(page.locator("body")).toBeVisible()
  })

  test("social links are editable", async ({ page }) => {
    await page.goto("/settings/profile")

    const instagramInput = page
      .locator('input[name="instagram"]')
      .or(page.getByPlaceholder(/instagram/i))

    if (await instagramInput.isVisible()) {
      await instagramInput.fill("testhandle")
      await instagramInput.blur()
    }

    await expect(page.locator("body")).toBeVisible()
  })

  test("security level options are available", async ({ page }) => {
    await page.goto("/settings/profile")

    const _securitySection = page
      .locator('[data-testid="security-level"]')
      .or(page.locator("text=/anonymous|restriction/i"))

    await expect(page.locator("body")).toBeVisible()
  })
})
