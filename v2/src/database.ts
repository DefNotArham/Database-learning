import crypto from "crypto";
import fs from "fs";

type Document = {
  id: string;
  [key: string]: unknown;
};

class Database {
  private data: Document[] = [];

  constructor() {
    const file = fs.readFileSync("database/database.json", "utf-8");
    const data = JSON.parse(file);
    this.data = data;
  }

  insert(document: Omit<Document, "id">) {
    const id = crypto.randomUUID();

    this.data.push({
      id,
      ...document,
    });
  }

  findMany(query: Record<string, unknown>) {
    return this.data.filter((document) => {
      const keys = Object.keys(query);

      return keys.every((key) => {
        return document[key] === query[key];
      });
    });
  }

  findOne(query: Record<string, unknown>) {
    return this.data.find((document) => {
      const keys = Object.keys(query);

      return keys.every((key) => {
        return document[key] === query[key];
      });
    });
  }

  updateOne(
    query: Record<string, unknown>,
    changeQuery: Record<string, unknown>,
  ) {
    const data = this.data.find((document) => {
      const keys = Object.keys(query);

      return keys.every((key) => {
        return document[key] === query[key];
      });
    });

    if (!data) return;

    const key = Object.keys(changeQuery)[0];
    data[key] = changeQuery[key];
  }

  deleteOne(query: Record<string, unknown>) {
    const index = this.data.findIndex((document) => {
      const keys = Object.keys(query);

      return keys.every((key) => {
        return document[key] === query[key];
      });
    });

    if (index === -1) return;

    this.data.splice(index, 1);
  }

  save() {
    fs.writeFileSync(
      "database/database.json",
      JSON.stringify(this.data, null, 2),
    );
  }
}

export default Database;
