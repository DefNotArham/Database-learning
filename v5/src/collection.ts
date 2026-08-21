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

    const keys = Object.keys(document); // keys = ["name", "age"]

    for (let i = 0; i < keys.length; i++) {
      const field = keys[i]; // field = "name" or field = "age" ...etc
      const index = this.indexes[field]; // "Arham" --> ["8f3a...", "7c42..."]
      if (index) {
        const value: unknown = document[field]; // "Arham"

        if (index.has(value)) {
          const ids = index.get(value);

          if (ids) {
            ids.push(id);
          }
        } else {
          index.set(value, [id]);
        }
      }
    }
  }

  findMany(query: Record<string, unknown>) {
    const keys = Object.keys(query);
    const field = keys[0];
    const index = this.indexes[field];

    if (index) {
      const ids = index.get(query[field]);

      if (ids) {
        return this.data.filter((document) => {
          return ids.includes(document.id);
        });
      }
    }

    return this.data.filter((document) => {
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
    const index = this.indexes[key];

    const oldValue = data[key];
    const newValue = changeQuery[key];

    if (index) {
      // Remove the document ID from the old value
      const oldIds = index.get(oldValue);

      if (oldIds) {
        const idIndex = oldIds.findIndex((id) => {
          return id === data.id;
        });

        if (idIndex !== -1) {
          oldIds.splice(idIndex, 1);
        }
      }

      // Add the document ID to the new value
      if (index.has(newValue)) {
        const newIds = index.get(newValue);

        if (newIds) {
          newIds.push(data.id);
        }
      } else {
        index.set(newValue, [data.id]);
      }
    }

    // Finally update the actual document
    data[key] = newValue;
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
        const ids = index.get(value);

        ids?.push(document.id);
      } else {
        index.set(value, [document.id]);
      }
    }

    this.indexes[field] = index;
  }
}

export default Collection;
