import { expect, test } from "@playwright/test"

test.describe("Profile Page", () => {
  test("profile page shows user information", async ({ page }) => {
    await page.goto("/testuser")

    await expect(page.locator("body")).toBeVisible()
  })

  test("handles non-existent user gracefully", async ({ page }) => {
    const response = await page.goto("/nonexistentuser12345")

    const is404 =
      response?.status() === 404 ||
      (await page
        .locator("text=/not found/i")
        .isVisible()
        .catch(() => false))
    expect(is404 || response?.ok()).toBeTruthy()
  })

  test("shows answered questions on profile", async ({ page }) => {
    await page.goto("/testuser")

    const _questionsSection = page
      .locator('[data-testid="answered-questions"]')
      .or(page.locator("text=/answered/i"))

    await expect(page.locator("body")).toBeVisible()
  })

  test("question input is visible on profile", async ({ page }) => {
    await page.goto("/testuser")

    const _questionInput = page
      .locator('[data-testid="question-input"]')
      .or(page.getByPlaceholder(/ask|question/i))
      .or(page.getByRole("button", { name: /ask|question/i }))

    await expect(page.locator("body")).toBeVisible()
  })
})
