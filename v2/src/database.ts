import crypto from "node:crypto";
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

  find(query: Record<string, unknown>) {
    return this.data.filter((document) => {
      const key = Object.keys(query)[0];

      return document[key] === query[key];
    });
  }

  save() {
    fs.writeFileSync(
      "database/database.json",
      JSON.stringify(this.data, null, 2),
    );
  }

  showDocument() {
    console.log(this.data);
  }
}

export default Database;
