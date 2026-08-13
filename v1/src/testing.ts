import database from "./database.js";

const db = new database();

db.set("name", "arham");
db.set("yoo", "kabir");
db.save();
console.log(db.has("name"));

const name = db.get("name");

console.log(name);
