export interface BaseUser {
  name: string;
  age: number;
  dateOfBirth: string;
}

export interface User extends BaseUser {
  userId: number;
}
