import crypto from "node:crypto";

type Document = {
  id: string;
  [key: string]: unknown;
};

class Database {
  private data: Document[] = [];

  insert(document: Omit<Document, "id">) {
    const id = crypto.randomUUID();

    this.data.push({
      id,
      ...document,
    });
  }
}
