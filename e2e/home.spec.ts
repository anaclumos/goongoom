import { expect, test } from "@playwright/test"

test.describe("Home Page", () => {
  test("landing page loads successfully", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/궁금닷컴|goongoom/i)
  })

  test("page renders main content", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("body")).toBeVisible()
    await expect(page.locator("main, [role='main'], #__next")).toBeVisible()
  })

  test("navigation links work", async ({ page }) => {
    await page.goto("/")

    const termsLink = page.getByRole("link", { name: /terms/i })
    if (await termsLink.isVisible()) {
      await termsLink.click()
      await expect(page).toHaveURL(/terms/)
    }
  })

  test("page is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")

    await expect(page.locator("body")).toBeVisible()
  })
})
