const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Koble til SQLite-database
const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.error("Feil ved tilkobling til database:", err.message);
    } else {
        console.log("Tilkoblet SQLite-database.");
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )
        `);
    }
});

// Registrer ny bruker
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (row) {
            return res.status(400).json({ message: "Brukernavn er allerede tatt" });
        }
        bcrypt.hash(password, 10, (err, hash) => {
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], (err) => {
                if (err) {
                    return res.status(500).json({ message: "Feil ved registrering" });
                }
                res.json({ message: "Bruker registrert!" });
            });
        });
    });
});

// Logg inn
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (!row) {
            return res.status(400).json({ message: "Feil brukernavn eller passord" });
        }
        bcrypt.compare(password, row.password, (err, result) => {
            if (result) {
                res.json({ message: "Innlogging vellykket", username: row.username });
            } else {
                res.status(400).json({ message: "Feil brukernavn eller passord" });
            }
        });
    });
});

// Slett bruker
app.post("/delete", (req, res) => {
    const { username } = req.body;
    
    db.run("DELETE FROM users WHERE username = ?", [username], (err) => {
        if (err) {
            return res.status(500).json({ message: "Feil ved sletting av bruker" });
        }
        res.json({ message: "Bruker slettet" });
    });
});


const path = require("path");

// Server statiske filer fra "public"-mappen
app.use(express.static(path.join(__dirname, "public")));

// Send index.html som default
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});




app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});
