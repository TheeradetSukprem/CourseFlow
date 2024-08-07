import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const subscriptionRouter = Router();

//============Get all subscriptions
subscriptionRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`
        SELECT courses.coursename, subscriptions.*
        FROM subscriptions
        JOIN courses ON subscriptions.courseid = courses.courseid
        ORDER BY subscriptionid asc`);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching subscriptions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//============Get user subscriptions and show assignments
subscriptionRouter.get("/user/:userId", async (req, res) => {
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
where users.userid = $1 
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

export default subscriptionRouter;
