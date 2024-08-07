import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const submissionRouter = Router();

//=========Get submission and assignment dat

//=========Get all submission
submissionRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(
      `select * from submissions order by submissionid asc`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error` });
  }
});

//===========Get all user submission by user id
submissionRouter.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await connectionPool.query(
      `select 
courses.coursename ,
courses.courseid,
modules.modulename ,
sublesson.sublessonname ,
assignments.title ,
assignments.assignmentid,
submissions.status ,
submissions.answer
from users
inner join subscriptions using (userid)
inner join courses using (courseid)
inner join modules using (courseid)
inner join sublesson using (moduleid)
inner join assignments using (sublessonid)
inner join submissions on (assignments.assignmentid = submissions.assignmentid)
where submissions.userid = $1 
group by 
courses.coursename ,
courses.courseid, 
modules.modulename , 
sublesson.sublessonname , 
courses.courseid,
assignments.title , 
submissions.status ,
submissions.answer,
assignments.assignmentid;
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not subscribed to any course yet." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});

//===========Get user pending submission by user id
submissionRouter.get("/pending/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await connectionPool.query(
      `select 
courses.coursename ,
modules.modulename ,
sublesson.sublessonname ,
assignments.title ,
assignments.assignmentid,
submissions.status ,
submissions.answer
from users
inner join subscriptions using (userid)
inner join courses using (courseid)
inner join modules using (courseid)
inner join sublesson using (moduleid)
inner join assignments using (sublessonid)
inner join submissions on (assignments.assignmentid = submissions.assignmentid)
where submissions.userid = $1 and  submissions.status = 'Pending'
group by  courses.coursename , 
modules.modulename , 
sublesson.sublessonname , 
assignments.title , 
submissions.status ,
submissions.answer,
assignments.assignmentid;
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User is not subscribed to any course yet." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});

//==========user submit handle
submissionRouter.put(
  "/user/:userid/assignment/:assignmentId/submit",
  async (req, res) => {
    const newSubmit = {
      ...req.body,
      submissiondate: new Date(),
    };
    const assignmentId = req.params.assignmentId; // Fixed this line
    const userId = req.params.userid;
    try {
      await connectionPool.query(
        `UPDATE submissions
        SET submissiondate = $1, status = 'Submitted', answer = $2
        WHERE userid = $3 AND assignmentid = $4`,
        [newSubmit.submissiondate, newSubmit.answer, userId, assignmentId]
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error submitting answer" });
    }
    return res.status(201).json({
      message: "Submit answer successfully",
    });
  }
);

export default submissionRouter;
