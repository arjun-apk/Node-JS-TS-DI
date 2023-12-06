import request from "supertest";
import { app } from "../src/index";
import { User } from "../src/model/user";

let createdUser: User;

describe("GET - /users", () => {
  it("Get all users", async () => {
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

describe("POST - /users", () => {
  it("Create user - Valid details", async () => {
    const newUser = {
      name: "John Doe",
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
  it("Create user - Invalid details", async () => {
    const newUser = {
      name: "John Doe",
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

describe("GET - /users/:id", () => {
  it("Get user - Valid id", async () => {
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
  it("Get user - Invalid id", async () => {
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

describe("PUT - /users/:id", () => {
  it("Update user - Valid id and valid details", async () => {
    const updatedDetails = {
      name: "Doe John",
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
  it("Update user - Invalid id and valid details", async () => {
    const updatedDetails = {
      name: "John Doe",
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
  it("Update user - Valid id and Invalid details", async () => {
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
  it("Update user - Invalid id and Invalid details", async () => {
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

describe("DELETE - /users/:id", () => {
  it("Delete user - Valid id", async () => {
    const response = await request(app).delete(`/users/${createdUser.userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data: null,
      resultCode: 200,
      message: "Deleted successfully",
    });
  });
  it("Delete user - Invalid id", async () => {
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
