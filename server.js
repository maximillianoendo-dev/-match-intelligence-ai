
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve the website files from the project folder
app.use(express.static(__dirname));

// Display the website homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Fetch live football fixtures
app.get("/api/fixtures", async (req, res) => {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "API key is not configured"
    });
  }

  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": apiKey
        }
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Fixture error:", error);

    res.status(500).json({
      error: "Unable to fetch fixtures"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
