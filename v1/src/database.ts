import fs from "fs";

class database {
  private data: Record<string, unknown> = {};

  constructor() {
    const file = fs.readFileSync("data/database.json", "utf-8");

    const data = JSON.parse(file);
    this.data = data;
  }

  set(key: string, value: unknown) {
    this.data[key] = value;
  }

  get(key: string) {
    return this.data[key];
  }

  has(key: string) {
    return key in this.data;
  }

  delete(key: string) {
    delete this.data[key];
    this.save();
  }

  save() {
    fs.writeFileSync("data/database.json", JSON.stringify(this.data, null, 2));
  }
}

export default database;
