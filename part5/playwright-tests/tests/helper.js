const { expect } = require("@playwright/test");

const loginWith = async (page, username, password) => {
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlogWith = async (page, title, author, url) => {
  await page.getByRole("button", { name: "new blog" }).click();
  await page.getByLabel("Title:").fill(title);
  await page.getByLabel("Author:").fill(author);
  await page.getByLabel("URL:").fill(url);
  await page.getByRole("button", { name: "create" }).click();
};

const blogListHasOrder = async (page, titlesInOrder) => {
  const blogs = await page.locator(".blog");
  for (let i = 0; i < titlesInOrder.length; i++) {
    await expect(blogs.nth(i)).toContainText(titlesInOrder[i]);
  }
};

export { loginWith, createBlogWith, blogListHasOrder };
