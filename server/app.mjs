import express from "express";
import client from "./utils/db.mjs";

const app = express();
app.use(express.json());

const port = 4000;

//Connection test
async function connect() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL database");
  } catch {
    console.error("Error connecting to database:");
    process.exit(1);
  }
}

connect();

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/users", async (req, res) => {
  let result;
  try {
    result = await client.query(`select * from users`);
    res.status(200).json(result.rows);
  } catch {
    res.status(500).json({ message: `Internal Server Error` });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port} 🚀`);
});
