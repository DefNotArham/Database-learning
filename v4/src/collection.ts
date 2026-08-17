import crypto from "crypto";
import fs from "fs";

type Document = {
  id: string;
  [key: string]: unknown;
};

class Collection {
  private data: Document[] = [];
  private name: string;
  private indexes: Record<string, Map<unknown, string[]>> = {};

  constructor(name: string) {
    this.name = name;

    if (fs.existsSync(`database/${this.name}/data.json`)) {
      const file = fs.readFileSync(`database/${this.name}/data.json`, "utf-8");

      const data = JSON.parse(file);

      this.data = data;
    }
  }

  insert(document: Record<string, unknown>) {
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

  getData() {
    return this.data;
  }

  save() {
    fs.mkdirSync(`database/${this.name}`, { recursive: true });

    fs.writeFileSync(
      `database/${this.name}/data.json`,
      JSON.stringify(this.data, null, 2),
    );
  }

  createIndex(field: string) {
    const index: Map<unknown, string[]> = new Map();

    for (const document of this.data) {
      const value: unknown = document[field];

      if (index.has(value)) {
        const ids: string[] | undefined = index.get(value);

        ids?.push(document.id);
      } else {
        index.set(value, [document.id]);
      }
    }

    this.indexes[field] = index;
  }
}

export default Collection;
