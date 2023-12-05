import request from "supertest";
import { app } from "../src/index";

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
