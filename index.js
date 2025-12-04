const express = require("express");
const { MongoClient } = require("mongodb");
// fghfghfgh
const app = express();
app.use(express.json());
const port = 3000;
let db;

const startServer = async () => {
  // Connect to MongoDB
  const client = await MongoClient.connect("mongodb://localhost:27017/");
  db = client.db("todo");

  // Seed some example todos
  await db.collection("todos").insertMany([
    { id: "1", title: "Buy groceries" },
    { id: "2", title: "Install Aspecto" },
    { id: "3", title: "buy my own name domain" },
  ]);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();

// GET /todo -> all todos
app.get("/todo", async (req, res) => {
  const todos = await db.collection("todos").find({}).toArray();
  res.send(todos);
});

// GET /todo/:id -> single todo
app.get("/todo/:id", async (req, res) => {
  const todo = await db.collection("todos").findOne({ id: req.params.id });
  res.send(todo);
});
