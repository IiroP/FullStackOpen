const { test, after, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require('../models/user')
const api = supertest(app)

const initialUsers = [
	{
		username: "user1",
		name: "User One",
	},
]

beforeEach(async () => {
	await User.deleteMany({})

	for (let user of initialUsers) {
		let newUser = new User(user)
		await newUser.save()
	}
})

describe("user creation", () => {
	test("succeeds with valid data", async () => {
		const newUser = {
			username: "testuser",
			name: "Test User",
			password: "testpassword"
		}
		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/)

		assert.strictEqual(response.body.username, newUser.username)

		// Confirm that the user was created
		const users = await api.get("/api/users").expect(200)
		assert.strictEqual(users.body.length, initialUsers.length + 1)
	});

	test("fails if password is not provided", async () => {
		const newUser = {
			username: "testuser",
			name: "Test User"
		}
		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)

		assert.strictEqual(response.body.error, "Password not found or too short")

		// Confirm that the user was not created
		const users = await api.get("/api/users").expect(200)
		assert.strictEqual(users.body.length, initialUsers.length)
	})

	test("fails if password is too short", async () => {
		const newUser = {
			username: "testuser",
			name: "Test User",
			password: "ab"
		}
		const response = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)

		assert.strictEqual(response.body.error, "Password not found or too short")

		// Confirm that the user was not created
		const users = await api.get("/api/users").expect(200)
		assert.strictEqual(users.body.length, initialUsers.length)
	})


})


after(async () => {
	await mongoose.connection.close()
})