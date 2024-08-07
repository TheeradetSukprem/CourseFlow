import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const assignmentRouter = Router();

//==========Get assignment for unique user id
assignmentRouter.get("/user/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const result = await connectionPool.query(
      `
        SELECT 
          a.assignmentid,
          a.title,
          a.description,
          a.duedate,
          a.courseid,
          c.coursename,
          a.moduleid,
          m.modulename,
          a.sublessonid,
          s.sublessonname,
          a.createddate,
          b.status,
          b.answer
        FROM 
          assignments a
        LEFT JOIN 
          courses c ON a.courseid = c.courseid
        LEFT JOIN 
          modules m ON a.moduleid = m.moduleid
        LEFT JOIN 
          sublesson s ON a.sublessonid = s.sublessonid
        LEFT JOIN 
          submissions b ON a.assignmentid = b.assignmentid
        WHERE 
          b.userid = $1
      `,
      [userid]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching assignments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get assignment status
assignmentRouter.get("/users/assignment-status", async (req, res) => {
  const { assignmentid } = req.query;
  try {
    const result = await connectionPool.query(
      "SELECT status FROM submissions WHERE assignmentid = $1",
      [assignmentid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching assignment status" });
  }
});

// Update assignment status
assignmentRouter.post("/users/update-assignment-status", async (req, res) => {
  const { assignmentid, status } = req.body;
  try {
    await connectionPool.query(
      "UPDATE submissions SET status = $1 WHERE assignmentid = $2",
      [status, assignmentid]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating assignment status" });
  }
});

// Submit assignment endpoint
assignmentRouter.post("/users/submit-assignment", async (req, res) => {
  const { assignmentid, userid, answer, submissiondate, status, grade } =
    req.body;

  if (!assignmentid || !userid || !answer || !submissiondate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await connectionPool.query(
      `INSERT INTO submissions (assignmentid, userid, answer, submissiondate, status, grade)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [assignmentid, userid, answer, submissiondate, status, grade]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting submission:", error);
    res.status(500).json({ message: "Error inserting submission" });
  }
});

export default assignmentRouter;
