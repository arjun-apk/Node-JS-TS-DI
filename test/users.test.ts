import request from "supertest";
import { app } from "../src/index";
import {
  BaseUserOptional,
  BaseUserOptionalSchema,
  BaseUserSchema,
  User,
  UserIdSchema,
} from "../src/model/user";
import { UserMessage } from "../src/const/users/userMessage";

let users: User[] = [];
let createdUser: User;

const runGetAllUsersTest = (title: string, data: User[]) => {
  it(title, async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: true,
      data,
      resultCode: 200,
      message: UserMessage.success.read,
    });
  });
};

describe("GET - Get all users 1 - /users", () => {
  runGetAllUsersTest("Before create user", []);
});

describe("POST - Create user - /users", () => {
  const validTestCases = [
    {
      name: "Abc Z",
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Xyz",
      age: 22,
      dateOfBirth: "2001-04-15T12:00:00.000Z",
    },
  ];
  validTestCases.forEach((eachValidTestCase, index) => {
    it(`Valid details - Test case ${index + 1}`, async () => {
      const response = await request(app)
        .post("/users")
        .send(eachValidTestCase);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: true,
        data: {
          userId: expect.any(Number),
          ...eachValidTestCase,
        },
        resultCode: 201,
        message: UserMessage.success.created,
      });
      createdUser = response.body.data;
      users.push(createdUser);
    });
  });
  const invalidTestCases = [
    {
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "",
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: null,
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: 1,
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
      age: "30",
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
      age: null,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
      age: -30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
      age: 30,
      dateOfBirth: null,
    },
    {
      name: "Abc Z",
      age: 30,
    },
    {
      name: "Abc Z",
      age: 30,
      dateOfBirth: "1993-05-15",
    },
    {
      name: "Abc Z",
      age: 30,
      dateOfBirth: "1993-05-15T12:000:000.000Z",
    },
    {
      name: 30,
      age: "Abc Z",
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: 1,
      age: 30,
      dateOfBirth: "1993-05-15 12:00:00.000Z",
    },
    {
      name: "Abc Z",
      age: -30,
      dateOfBirth: "1993-05-15T12:00:00.000",
    },
  ];
  invalidTestCases.forEach((eachInvalidTestCase, index) => {
    it(`Invalid details - Test case ${index + 1}`, async () => {
      const validUser = BaseUserSchema.safeParse(eachInvalidTestCase);
      if (!validUser.success) {
        const response = await request(app)
          .post("/users")
          .send(eachInvalidTestCase);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          data: null,
          resultCode: 400,
          message: UserMessage.getErrorMessage(validUser.error.issues),
        });
      }
    });
  });
});

describe("GET - Get all users 2 - /users", () => {
  runGetAllUsersTest("After create user", users);
});

describe("GET - Get user - /users/:id", () => {
  const validTestCases = [{ userId: 1 }, { userId: 2 }];
  validTestCases.forEach((eachValidTestCase, index) => {
    it(`Valid id - Test case  ${index + 1}`, async () => {
      const response = await request(app).get(
        `/users/${eachValidTestCase.userId}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: true,
        data: {
          userId: users[index].userId,
          name: users[index].name,
          age: users[index].age,
          dateOfBirth: users[index].dateOfBirth,
        },
        resultCode: 200,
        message: UserMessage.success.read,
      });
    });
  });
  const inValidTestCases1 = [{ userId: 100 }, { userId: 200 }];
  inValidTestCases1.forEach((eachValidTestCase, index) => {
    it(`Invalid id - Test case ${index + 1}`, async () => {
      const response = await request(app).delete(
        `/users/${eachValidTestCase.userId}`
      );
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        data: null,
        resultCode: 400,
        message: UserMessage.failure.invalidId,
      });
    });
  });
  const inValidTestCases2 = [
    { userId: 100 },
    { userId: null },
    {},
    { userId: -1 },
  ];
  inValidTestCases2.forEach((eachValidTestCase, index) => {
    it(`Invalid id - Test case ${
      index + 1 + inValidTestCases1.length
    }`, async () => {
      const validId = UserIdSchema.safeParse(eachValidTestCase.userId);
      if (!validId.success) {
        const response = await request(app).get(
          `/users/${eachValidTestCase.userId}`
        );
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          data: null,
          resultCode: 400,
          message: UserMessage.getErrorMessage(validId.error.issues),
        });
      }
    });
  });
});

describe("PUT - Update user - /users/:id", () => {
  const validTestCases = [
    {
      name: "Abc",
      age: 25,
      dateOfBirth: "1993-07-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
      age: 30,
    },
    {
      name: "Abc Z",
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      age: 30,
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
    {
      name: "Abc Z",
    },
    {
      age: 30,
    },
    {
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
  ];
  validTestCases.forEach((eachValidTestCase: BaseUserOptional, index) => {
    it(`Valid details - Test case ${index + 1}`, async () => {
      const userId = 1;
      const response = await request(app)
        .put(`/users/${1}`)
        .send(eachValidTestCase);
      const updatedUser = { ...users[0], ...eachValidTestCase };
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: true,
        data: updatedUser,
        resultCode: 200,
        message: UserMessage.success.updated,
      });
      users = users.map((eachUser) => {
        if (eachUser.userId === userId) return updatedUser;
        return eachUser;
      });
    });
  });
  const inValidTestCases1 = [
    {},
    {
      name: 10,
      age: "25",
      dateOfBirth: "1993-07-15T12:00:00.000Z",
    },
    {
      name: "",
      age: "25",
      dateOfBirth: "1993-07-15T12:00:00.000Z",
    },
    {
      name: null,
      age: -30,
    },
    {
      name: undefined,
      dateOfBirth: "1993-05-15",
    },
    {
      name: null,
      dateOfBirth: "1993-05-15:00:00.000Z",
    },
    {
      age: 30,
      dateOfBirth: "1993-05-15T12;00:00.000Z",
    },
    {
      name: "",
    },
    {
      age: 30,
    },
    {
      dateOfBirth: "1993-05-15T12:00:00.000Z",
    },
  ];
  inValidTestCases1.forEach((eachInvalidTestCase, index) => {
    it(`Invalid details - Test case ${index + 1}`, async () => {
      const validUser = BaseUserOptionalSchema.safeParse(eachInvalidTestCase);
      if (!validUser.success) {
        const response = await request(app)
          .put(`/users/${2}`)
          .send(eachInvalidTestCase);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          data: null,
          resultCode: 400,
          message: UserMessage.getErrorMessage(validUser.error.issues),
        });
      }
    });
  });
  const inValidTestCases2 = [{ userId: 100 }, { userId: 200 }];
  inValidTestCases2.forEach((eachInvalidTestCase, index) => {
    it(`Invalid id - Test case ${index + 1}`, async () => {
      const response = await request(app)
        .put(`/users/${eachInvalidTestCase.userId}`)
        .send({
          age: 30,
        });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        data: null,
        resultCode: 400,
        message: UserMessage.failure.invalidId,
      });
    });
  });
});

describe("GET - Get all users 3 - /users", () => {
  runGetAllUsersTest("After update user", users);
});

describe("DELETE - Delete user - /users/:id", () => {
  const validTestCases = [{ userId: 1 }, { userId: 2 }];
  validTestCases.forEach((eachValidTestCase, index) => {
    it(`Valid id - Test case ${index + 1}`, async () => {
      const response = await request(app).delete(
        `/users/${eachValidTestCase.userId}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: true,
        data: null,
        resultCode: 200,
        message: UserMessage.success.deleted,
      });
    });
  });
  validTestCases.forEach((eachValidTestCase, index) => {
    it(`Invalid id - Test case ${index + 1}`, async () => {
      const response = await request(app).delete(
        `/users/${eachValidTestCase.userId}`
      );
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: false,
        data: null,
        resultCode: 400,
        message: UserMessage.failure.invalidId,
      });
    });
  });
  const inValidTestCases = [{ userId: null }, {}, { userId: -1 }];
  inValidTestCases.forEach((eachValidTestCase, index) => {
    it(`Invalid id - Test case ${
      index + 1 + validTestCases.length
    }`, async () => {
      const validId = UserIdSchema.safeParse(eachValidTestCase.userId);
      if (!validId.success) {
        const response = await request(app).delete(
          `/users/${eachValidTestCase.userId}`
        );
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          status: false,
          data: null,
          resultCode: 400,
          message: UserMessage.getErrorMessage(validId.error.issues),
        });
      }
    });
  });
});

describe("GET - Get all users 4 - /users", () => {
  runGetAllUsersTest("After delete user", []);
});
