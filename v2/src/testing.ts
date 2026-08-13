import Database from "./database.js";
const db = new Database();

db.insert({ name: "Arham" });

db.save();
