import { z } from "zod";
import { UserMessage } from "../const/users/userMessage";

export const BaseUserSchema = z.object({
  name: z.string({
    invalid_type_error: UserMessage._name.invalidType,
    required_error: UserMessage._name.required,
  }),
  age: z
    .number({
      invalid_type_error: UserMessage.age.invalidType,
      required_error: UserMessage.age.required,
    })
    .positive(UserMessage.age.positive),
  dateOfBirth: z
    .string({
      invalid_type_error: UserMessage.dateOfBirth.invalidType,
      required_error: UserMessage.dateOfBirth.required,
    })
    .datetime({ message: UserMessage.dateOfBirth.datetime }),
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
    invalid_type_error: UserMessage.userId.invalidType,
    required_error: UserMessage.userId.invalidType,
  })
  .positive(UserMessage.userId.positive);

export type UserId = z.infer<typeof UserIdSchema>;
