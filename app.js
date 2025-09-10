const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Manga resources array with unique IDs
let resources = [
  { id: 1, title: "One Piece", type: "Manga", link: "https://comick.io/comic/02-one-piece/NyDXL-chapter-1-en" },
  { id: 2, title: "Naruto", type: "Manga", link: "https://comick.io/comic/naruto/QOv5-chapter-1-en" },
  { id: 3, title: "My Hero Academia", type: "Manga", link: "https://comick.io/comic/01-my-hero-academia-full-colored/6kW5ioT1-chapter-1-en" },
  { id: 4, title: "Dragon Ball", type: "Manga", link: "https://comick.io/comic/00-dragon-ball-super/MxyP3-chapter-1-en" },
  { id: 5, title: "Bleach", type: "Manga", link: "https://comick.io/comic/bleach/AgV11-chapter-1-en" },
  { id: 6, title: "One Punch Man", type: "Manga", link: "https://comick.io/comic/01-one-punch-man-fan-colored/al6iGQue-chapter-0-en" },
  { id: 7, title: "Fullmetal Alchemist", type: "Manga", link: "https://comick.io/comic/fullmetal-alchemist/JxDqD-chapter-1-en" }
];

// Homepage → READ
app.get("/", (req, res) => {
  let resourceList = resources
    .map(r => `
      <div class="card">
        <div class="info">
          <a href="${r.link}" target="_blank" class="title">${r.title}</a>
          <span class="type"> — ${r.type}</span>
        </div>
        <div class="actions">
          <a href="/edit/${r.id}" class="btn edit">✏️ Edit</a>
          <a href="/delete/${r.id}" class="btn delete" onclick="return confirm('Are you sure you want to delete ${r.title}?')">🗑️ Delete</a>
        </div>
      </div>
    `)
    .join("");

  res.send(`
    <html>
    <head>
      <title>Manga Resource Library</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>📚 Manga Resource Library</h1>
      <p>Browse, add, edit, or delete manga resources below:</p>
      <div class="container">
        ${resourceList}
      </div>
      <br>
      <a href="/add" class="btn add">➕ Add New Manga Resource</a>
    </body>
    </html>
  `);
});

// Add resource form → CREATE
app.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "add.html"));
});

// Handle new resource submission → CREATE
app.post("/add", (req, res) => {
  const { title, type, link } = req.body;
  const id = resources.length ? resources[resources.length - 1].id + 1 : 1;
  resources.push({ id, title, type, link });
  res.redirect("/");
});

// Edit resource form → UPDATE
app.get("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const resource = resources.find(r => r.id === id);
  if (!resource) return res.status(404).send("Manga not found!");

  res.send(`
    <html>
    <head>
      <title>Edit Manga</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>✏️ Edit Manga Resource</h1>
      <form action="/edit/${id}" method="POST" class="form">
        <label>Title:</label><br>
        <input type="text" name="title" value="${resource.title}" required><br><br>

        <label>Type:</label><br>
        <input type="text" name="type" value="${resource.type}" required><br><br>

        <label>Link:</label><br>
        <input type="url" name="link" value="${resource.link}" required><br><br>

        <button type="submit" class="btn edit">💾 Save Changes</button>
      </form>
      <br>
      <a href="/" class="btn">⬅️ Back</a>
    </body>
    </html>
  `);
});

// Handle edit submission → UPDATE
app.post("/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, type, link } = req.body;

  const index = resources.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).send("Manga not found!");

  resources[index] = { id, title, type, link };
  res.redirect("/");
});

// Delete a resource → DELETE
app.get("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  resources = resources.filter(r => r.id !== id);
  res.redirect("/");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
