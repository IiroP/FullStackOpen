import axios from "axios";

export const getAnecdotes = async () => {
  const res = await axios.get("http://localhost:3001/anecdotes");
  return res.data;
};

export const createAnecdote = async (newAnecdote) => {
  const res = await axios.post("http://localhost:3001/anecdotes", newAnecdote);
  return res.data;
};

export const voteAnecdote = async (id) => {
  const anecdote = await axios.get(`http://localhost:3001/anecdotes/${id}`);
  const updatedAnecdote = { ...anecdote.data, votes: anecdote.data.votes + 1 };
  await axios.put(`http://localhost:3001/anecdotes/${id}`, updatedAnecdote);
  return updatedAnecdote;
};
