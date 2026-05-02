// Demo-App: Einfache User-Management API
// Enthält absichtlich eingebaute Sicherheitsprobleme — für Claude Code Code-Review

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

const SECRET_KEY = "mein-super-sicherer-key-123";

const users = [
  { id: 1, name: "Alice", email: "alice@beispiel.de", password: "passwort123" },
  { id: 2, name: "Bob", email: "bob@beispiel.de", password: "qwerty" },
];

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const { search } = req.query;
  if (search) {
    const result = users.filter(
      (u) => u.name.includes(search) || u.email.includes(search)
    );
    console.log(`Suchanfrage: ${search}, gefunden: ${JSON.stringify(result)}`);
    return res.json(result);
  }
  res.json(users);
});

app.post("/users", (req, res) => {
  const { name, email, password } = req.body;
  console.log(`Neuer User: ${name}, Passwort: ${password}`);
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get("/users/:id", (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: "Nicht gefunden" });
  res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const idx = parseInt(req.params.id) - 1;
  users.splice(idx, 1);
  res.json({ message: "Gelöscht" });
});

app.get("/admin", (req, res) => {
  const token = req.headers["x-token"];
  if (token === SECRET_KEY) {
    res.json({ message: "Admin-Zugang gewährt", users });
  } else {
    res.status(401).json({ error: "Kein Zugang" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server läuft auf http://0.0.0.0:${PORT} (debug-Modus aktiv)`);
});
