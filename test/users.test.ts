import request from "supertest";
import { app } from "../src/index";
import { User } from "../src/model/user";

let createdUser: User;

describe("GET - Get all users - /users", () => {
  it("Valid details", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data: [
        {
          userId: 1,
          name: "Arjun P",
          age: 22,
          dateOfBirth: "2001-04-03T18:30:00.000Z",
        },
        {
          userId: 2,
          name: "APK",
          age: 23,
          dateOfBirth: "2001-04-03T18:30:00.000Z",
        },
      ],
      resultCode: 200,
      message: "Read successfully",
    });
  });
});

describe("POST - Create user - /users", () => {
  it("Valid details", async () => {
    const newUser = {
      name: "Abc Z",
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    };
    const response = await request(app).post("/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: true,
      data: {
        userId: expect.any(Number),
        ...newUser,
      },
      resultCode: 201,
      message: "Created successfully",
    });
    createdUser = response.body.data;
  });
  it("Invalid details", async () => {
    const newUser = {
      name: "Abc Z",
    };
    const response = await request(app).post("/users").send(newUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      data: null,
      resultCode: 400,
      message: "Invalid details",
    });
  });
});

describe("GET - Get user - /users/:id", () => {
  it("Valid id", async () => {
    const response = await request(app).get(`/users/${createdUser.userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data: {
        userId: createdUser.userId,
        name: createdUser.name,
        age: createdUser.age,
        dateOfBirth: createdUser.dateOfBirth,
      },
      resultCode: 200,
      message: "Read successfully",
    });
  });
  it("Invalid id", async () => {
    const response = await request(app).get(
      `/users/${createdUser.userId + 100}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      data: null,
      resultCode: 400,
      message: "Invalid id",
    });
  });
});

describe("PUT - Update user - /users/:id", () => {
  it("Valid id and valid details", async () => {
    const updatedDetails = {
      name: "Z Abc",
      age: 31,
    };
    const response = await request(app)
      .put(`/users/${createdUser.userId}`)
      .send(updatedDetails);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data: {
        userId: createdUser.userId,
        ...updatedDetails,
        dateOfBirth: createdUser.dateOfBirth,
      },
      resultCode: 200,
      message: "Updated successfully",
    });
  });
  it("Invalid id and valid details", async () => {
    const updatedDetails = {
      name: "Abc Z",
      age: 29,
      dateOfBirth: "1993-06-15T12:00:00.000Z",
    };
    const response = await request(app)
      .put(`/users/${createdUser.userId + 100}`)
      .send(updatedDetails);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      data: null,
      resultCode: 400,
      message: "Invalid id",
    });
  });
  it("Valid id and Invalid details", async () => {
    const updatedDetails = {};
    const response = await request(app)
      .put(`/users/${createdUser.userId}`)
      .send(updatedDetails);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      data: null,
      resultCode: 400,
      message: "Invalid details",
    });
  });
  it("Invalid id and Invalid details", async () => {
    const updatedDetails = {};
    const response = await request(app)
      .put(`/users/${createdUser.userId + 100}`)
      .send(updatedDetails);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      data: null,
      resultCode: 400,
      message: "Invalid details",
    });
  });
});

describe("DELETE - Delete user - /users/:id", () => {
  it("Valid id", async () => {
    const response = await request(app).delete(`/users/${createdUser.userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data: null,
      resultCode: 200,
      message: "Deleted successfully",
    });
  });
  it("Invalid id", async () => {
    const response = await request(app).delete(
      `/users/${createdUser.userId + 100}`
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: false,
      data: null,
      resultCode: 400,
      message: "Invalid id",
    });
  });
});
