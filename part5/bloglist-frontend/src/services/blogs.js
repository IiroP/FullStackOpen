import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const like = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const blogs = await getAll();
  const blog = blogs.find((b) => b.id === id);
  if (!blog) {
    throw new Error("blog not found");
  }
  const updatedBlog = {
    user: blog.user.id,
    likes: blog.likes + 1,
    author: blog.author,
    title: blog.title,
    url: blog.url,
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};

export default { getAll, setToken, create, like };
