import { z } from "zod";

export class UserMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
    empty: "Name must contain at least one character",
  };

  static age = {
    required: "Age required",
    invalidType: "Age must be a number",
    positive: "Age must be a positive number",
  };

  static dateOfBirth = {
    required: "Date of birth required",
    invalidType: "Date of birth must be a string",
    datetime: "Date of birth must be a string representing a datetime object",
  };

  static userId = {
    required: "Id required",
    invalidType: "Id must be a number",
    positive: "Id must be a positive number",
  };

  static getErrorMessage(issues: z.ZodIssue[]) {
    let errorMessage = "";
    issues.forEach((value) => (errorMessage += `${value.message}, `));
    return errorMessage.slice(0, -2) + ".";
  }

  static success = {
    read: "User read successfully",
    created: "User created successfully",
    updated: "User updated successfully",
    deleted: "User deleted successfully",
  };

  static failure = {
    invalidId: "Invalid user id",
    minimumField: "One of the fields must be defined",
  };
}
