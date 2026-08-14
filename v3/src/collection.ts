import crypto from "crypto";

type Document = {
  id: string;
  [key: string]: unknown;
};

class Collection {
  private data: Document[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  insert(query: Record<string, unknown>) {
    const id = crypto.randomUUID();

    this.data.push({
      id,
      ...query,
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
}

export default Collection;
