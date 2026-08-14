import Collection from "./collection.js";
import fs from "fs";

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

  getCollections() {
    return this.collections;
  }
}

export default Database;
