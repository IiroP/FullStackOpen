import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { test } from "vitest";

const blog = {
  title: "Title 1",
  author: "Author Name",
  likes: 201,
  url: "https://google.com",
  user: {
    name: "Sample User",
    username: "sampleuser",
  },
};

test("renders correct content when collapsed", () => {
  render(<Blog blog={blog} />);

  expect(screen.getByText(blog.title)).toBeDefined();
  expect(screen.getByText(blog.author)).toBeDefined();
  expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeNull();
  expect(screen.queryByText(blog.url)).toBeNull();
});

test("renders more information when opened", async () => {
  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("View");
  await user.click(button);

  expect(screen.getByText(blog.title)).toBeDefined();
  expect(screen.getByText(blog.author)).toBeDefined();
  expect(screen.getByText(`Likes: ${blog.likes}`)).toBeDefined();
  expect(screen.getByText(blog.url)).toBeDefined();
});

test("like button calls handler function", async () => {
  const mockHandler = vi.fn();

  render(<Blog blog={blog} addLike={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("View");
  await user.click(button);

  const likeButton = screen.getByText("Like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
