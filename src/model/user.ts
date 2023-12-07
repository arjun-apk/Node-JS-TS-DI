import { z } from "zod";

export class UserErrorMessage {
  static _name = {
    required: "Name required",
    invalidType: "Name must be a string",
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
}

export const BaseUserSchema = z.object({
  name: z.string({
    invalid_type_error: UserErrorMessage._name.invalidType,
    required_error: UserErrorMessage._name.required,
  }),
  age: z
    .number({
      invalid_type_error: UserErrorMessage.age.invalidType,
      required_error: UserErrorMessage.age.required,
    })
    .positive(UserErrorMessage.age.positive),
  dateOfBirth: z
    .string({
      invalid_type_error: UserErrorMessage.dateOfBirth.invalidType,
      required_error: UserErrorMessage.dateOfBirth.required,
    })
    .datetime({ message: UserErrorMessage.dateOfBirth.datetime }),
});

export type BaseUser = z.infer<typeof BaseUserSchema>;

export const BaseUserOptionalSchema = BaseUserSchema.partial();

export type BaseUserOptional = z.infer<typeof BaseUserOptionalSchema>;

export const UserSchema = BaseUserSchema.extend({
  userId: z.number(),
});

export type User = z.infer<typeof UserSchema>;

export const UserIdSchema = z
  .number({
    invalid_type_error: UserErrorMessage.userId.invalidType,
    required_error: UserErrorMessage.userId.required,
  })
  .positive(UserErrorMessage.userId.positive);

export type UserId = z.infer<typeof UserIdSchema>;
