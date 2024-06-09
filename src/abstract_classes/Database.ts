export default abstract class Database {
    private static db: unknown;

    setDbInstance(instance: unknown): void {
        if (!Database.db) Database.db = instance;
    }

}