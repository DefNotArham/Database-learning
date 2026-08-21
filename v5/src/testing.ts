import Database from "./database.js";

const db = new Database();

const users = db.collection("users");

users.insert({
  name: "Arham",
  age: 17,
  isStudent: true,
});

users.insert({
  name: "yoo",
  age: 110,
});

const testing = db.collection("testing");
testing.insert({
  testing: true,
});

users.save();
testing.save();
