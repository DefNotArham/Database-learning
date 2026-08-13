import crypto from "node:crypto";
import fs from "fs";
import { argv0 } from "node:process";

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
      const key = Object.keys(query)[0];

      return document[key] === query[key];
    });
  }

  findOne(query: Record<string, unknown>) {
    return this.data.find((document) => {
      const key = Object.keys(query)[0];

      return document[key] === query[key];
    });
  }

  updateOne(query: Record<string, unknown>, content: Record<string, unknown>) {
    const data = this.data.find((document) => {
      const key = Object.keys(query)[0];

      return document[key] === query[key];
    });

    if (!data) return;

    const key = Object.keys(content)[0];
    data[key] = content[key];
  }

  deleteOne(query: Record<string, unknown>) {
    const index = this.data.findIndex((document) => {
      const key = Object.keys(query)[0];

      return document[key] === query[key];
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

  showDocument() {
    console.log(this.data);
  }
}

export default Database;
