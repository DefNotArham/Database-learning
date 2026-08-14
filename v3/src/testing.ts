import Database from "./database.js";

const db = new Database();

const users = db.collection("users");

users.insert({
  name: "Arham",
  age: 17,
  isStudent: true,
});
