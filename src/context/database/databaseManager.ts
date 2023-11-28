export abstract class IDatabaseManager {
  static identity: string = "IDatabaseManager";

  abstract getConnection(): void;
}
