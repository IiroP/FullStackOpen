import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";

test("calls handler with correct values on submit", async () => {
  const blog = {
    title: "Title 123",
    author: "Author Example",
    url: "https://google.com",
  };
  const user = userEvent.setup();
  const createBlog = vi.fn();
  const showMessage = vi.fn();
  render(<BlogForm createBlog={createBlog} showMessage={showMessage} />);

  const titleInput = screen.getByLabelText("Title:");
  const authorInput = screen.getByLabelText("Author:");
  const urlInput = screen.getByLabelText("URL:");

  await user.type(titleInput, blog.title);
  await user.type(authorInput, blog.author);
  await user.type(urlInput, blog.url);
  await user.click(screen.getByText("Create blog"));

  expect(createBlog.mock.calls).toHaveLength(1);
  const params = createBlog.mock.calls[0][0];
  expect(params.title).toBe(blog.title);
  expect(params.author).toBe(blog.author);
  expect(params.url).toBe(blog.url);
});
