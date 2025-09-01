const { test, expect, beforeEach, describe } = require("@playwright/test");
import { loginWith, createBlogWith } from "./helper.js";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Testuser",
        username: "testuser",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("works with correct credentials", async ({ page }) => {
      await loginWith(page, "testuser", "salainen");

      await expect(page.getByText("Testuser logged in")).toBeVisible();
    });

    test("fails with wrong password", async ({ page }) => {
      await loginWith(page, "testuser", "wrong");

      await expect(
        page.getByText("Login failed, check username and password")
      ).toBeVisible();
      await expect(page.getByText("Test user logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "testuser", "salainen");
    });

    test("user can create a new blog", async ({ page }) => {
      await createBlogWith(
        page,
        "An example blog 123",
        "Test Tester",
        "https://google.com"
      );

      await expect(
        page.getByText("An example blog 123 Test Tester")
      ).toBeVisible();
    });

    test("user can like a blog", async ({ page }) => {
      await createBlogWith(
        page,
        "An example blog 123",
        "Test Tester",
        "https://google.com"
      );

      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByText("Likes: 0")).toBeVisible();

      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("Likes: 1")).toBeVisible();
    });
  });
});
