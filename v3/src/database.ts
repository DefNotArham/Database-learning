import Collection from "./collection.js";

class Database {
  private collections: Record<string, Collection> = {};

  collection(name: string) {
    if (this.collections[name]) {
      return this.collections[name];
    }

    const collection = new Collection(name);

    this.collections[name] = collection;

    return collection;
  }
}

export default Database;
