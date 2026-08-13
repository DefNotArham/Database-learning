import Database from "./database.js";

const db = new Database();

db.insert({ name: "Arham", age: 17 });
db.insert({ name: "Kabir" });

db.save();
const names = db.findMany({ name: "Arham" });
const name = db.findOne({ name: "Arham" });

console.log(name);
console.log(names);
