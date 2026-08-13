import Database from "./database.js";

const db = new Database();

db.insert({ name: "Arham", age: 17 });
db.insert({ name: "Kabir" });

db.showDocument();
