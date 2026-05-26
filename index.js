const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob Smith",    email: "bob@example.com",   role: "user"  },
];
let nextId = 3;

function validateUserInput(data) {
  const errors = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("'name' is required and must be a non-empty string.");
  }
  if (!data.email || typeof data.email !== "string") {
    errors.push("'email' is required and must be a string.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("'email' must be a valid email address.");
  }

  if (data.role && !["admin", "user", "moderator"].includes(data.role)) {
    errors.push("'role' must be one of: admin, user, moderator.");
  }

  return errors;
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "DecodeLabs Project 2 API is running ",
    endpoints: {
      "GET  /users":        "List all users",
      "GET  /users/:id":    "Get a single user by ID",
      "POST /users":        "Create a new user",
      "PUT  /users/:id":    "Update an existing user",
      "DELETE /users/:id":  "Delete a user",
    },
  });
});

app.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User with id ${id} not found.`,
    });
  }

  res.status(200).json({ success: true, data: user });
});

app.post("/users", (req, res) => {
  const errors = validateUserInput(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const duplicate = users.find(
    (u) => u.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (duplicate) {
    return res.status(400).json({
      success: false,
      errors: ["A user with this email already exists."],
    });
  }

  const newUser = {
    id:    nextId++,
    name:  req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
    role:  req.body.role || "user",
  };

  users.push(newUser);

  res.status(201).json({ success: true, data: newUser });
});

app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `User with id ${id} not found.`,
    });
  }

  const errors = validateUserInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  users[index] = {
    ...users[index],
    name:  req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
    role:  req.body.role || users[index].role,
  };

  res.status(200).json({ success: true, data: users[index] });
});

app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: `User with id ${id} not found.`,
    });
  }

  users.splice(index, 1);

  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;