import request from "supertest";
import { app } from "../src/index";
import { User } from "../src/model/user";

let createdUser: User;

describe("GET /users", () => {
  it("should return a list of users", async () => {
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

describe("POST /users", () => {
  it("should create a new user", async () => {
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
});

describe("GET /users/:id", () => {
  it("should return details of a specific user", async () => {
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
});

describe("PUT /users/:id", () => {
  it("should update details of a specific user", async () => {
    const updatedDetails = {
      name: "Updated Name",
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
});

describe("DELETE /users/:id", () => {
  it("should delete a specific user", async () => {
    const response = await request(app).delete(`/users/${createdUser.userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data: null,
      resultCode: 200,
      message: "Deleted successfully",
    });
  });
});
