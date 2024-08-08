import express from "express";
import cors from "cors";
import courseRouter from "./routes/course.mjs";
import userRouter from "./routes/user.mjs";
import connectionPool from "./utils/db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminRouter from "./routes/admin.mjs";
import profileRouter from "./routes/profiles.mjs";
import submissionRouter from "./routes/submission.mjs";
import subscriptionRouter from "./routes/subscriptions.mjs";
import assignmentRouter from "./routes/assignments.mjs";
import authenticateToken from "./middlewares/authentication.mjs";

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4000;

//Connection test
async function connect() {
  try {
    await connectionPool.connect();
    console.log("Connected to Supabase PostgreSQL database");
  } catch {
    console.error("Error connecting to database:");
    process.exit(1);
  }
}
connect();

app.use("/courses", courseRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/profiles", profileRouter);
app.use("/submissions", submissionRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/assignments", assignmentRouter);

//Server connection test
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

//log in api admin//
app.post("/login/admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const query = {
      text: "SELECT * FROM users WHERE email = $1 AND role = 'Admin'",
      values: [email],
    };

    const result = await client.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    // Validate password here, you might compare hashed passwords

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to mark a video as watched
// Route to mark a video as watched
app.post("/videos/view", async (req, res) => {
  const { sublessonid, userid, is_playing, is_ended } = req.body;

  console.log("Received data:", { sublessonid, userid, is_playing, is_ended });

  // Convert is_playing and is_ended to boolean
  const isPlayingBoolean = is_playing === "true" || is_playing === true;
  const isEndedBoolean = is_ended === "true" || is_ended === true;
  console.log("Converted is_playing to boolean:", isPlayingBoolean);
  console.log("Converted is_ended to boolean:", isEndedBoolean);

  try {
    const result = await connectionPool.query(
      `INSERT INTO video_views (userid, sublessonid, is_playing, is_ended) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (userid, sublessonid) 
       DO UPDATE SET is_playing = EXCLUDED.is_playing, is_ended = EXCLUDED.is_ended`,
      [userid, sublessonid, isPlayingBoolean, isEndedBoolean]
    );

    if (result.rowCount > 0) {
      res
        .status(201)
        .json({ message: "Video view state updated successfully" });
    } else {
      res
        .status(200)
        .json({ message: "Video view state updated successfully" });
    }
  } catch (err) {
    console.error("Error updating video view state:", err.message, err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get watched videos for a specific user
app.get("/videos/watched/:userid", async (req, res) => {
  const userid = parseInt(req.params.userid, 10); // Extract `userid` from URL params

  try {
    const result = await connectionPool.query(
      `SELECT sublessonid, viewed_at FROM video_views WHERE userid = $1`,
      [userid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching watched videos:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port} 🚀`);
});
