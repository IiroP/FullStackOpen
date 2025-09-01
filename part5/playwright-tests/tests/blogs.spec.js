const { test, expect, beforeEach, describe } = require("@playwright/test");
import { loginWith, createBlogWith, blogListHasOrder } from "./helper.js";

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
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "other user",
        username: "otheruser",
        password: "salainen2",
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

    test("user can delete their own blog", async ({ page }) => {
      await createBlogWith(
        page,
        "An example blog 123",
        "Test Tester",
        "https://google.com"
      );

      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByText("An example blog 123 Test Tester")
      ).toBeVisible();

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();

      await expect(
        page.getByText("An example blog 123 Test Tester")
      ).not.toBeVisible();

      await page.reload();
      await expect(
        page.getByText("An example blog 123 Test Tester")
      ).not.toBeVisible();
    });

    test("user cannot see delete button of other user's blog", async ({
      page,
    }) => {
      await createBlogWith(
        page,
        "An example blog 123",
        "Test Tester",
        "https://google.com"
      );

      await page.getByRole("button", { name: "logout" }).click();
      await loginWith(page, "otheruser", "salainen2");
      await page.getByRole("button", { name: "view" }).click();

      await expect(
        page.getByText("An example blog 123 Test Tester")
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "like" })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });

    test("blogs are ordered by likes", async ({ page }) => {
      await createBlogWith(
        page,
        "first blog",
        "Test Tester",
        "https://google.com"
      );
      await createBlogWith(
        page,
        "second blog",
        "Test Tester",
        "https://google.com"
      );
      await createBlogWith(
        page,
        "third blog",
        "Test Tester",
        "https://google.com"
      );

      await page.reload();

      await blogListHasOrder(page, ["first blog", "second blog", "third blog"]);

      const viewButton3 = page
        .locator("div")
        .filter({ hasText: /^third blog Test TesterView$/ })
        .getByRole("button");
      await viewButton3.click();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("Likes: 1")).toBeVisible();

      await page.reload();
      await blogListHasOrder(page, ["third blog", "first blog", "second blog"]);
    });
  });
});
