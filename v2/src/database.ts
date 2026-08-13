import crypto from "node:crypto";
import fs from "fs";

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
