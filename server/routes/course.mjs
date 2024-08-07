import { Router, text } from "express";
import connectionPool from "../utils/db.mjs";

const courseRouter = Router();

//============Get all courses
courseRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(
      `select * from courses order by courseid asc`
    );
    res.status(200).json(result.rows);
  } catch {
    res.status(500).json({ message: `Internal server error` });
  }
});

//=============Get all user subscribed
courseRouter.get("/user/:id/subscribed", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT courses.courseid, courses.coursename, courses.description, courses.coursesummary,
      courses.courselearningtime, subscriptions.subscriptiondate, courses.imagefile
      FROM courses
      JOIN subscriptions ON subscriptions.courseid = courses.courseid
      WHERE userid = $1
      ORDER BY subscriptiondate ASC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User were not subscribed to any course yet." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
});

//===========Get only user inprogress
courseRouter.get("/user/:id/inprogress", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT courses.courseid, courses.coursename, courses.description, courses.coursesummary,
      courses.courselearningtime, subscriptions.subscriptiondate, subscriptions.status, courses.imagefile
      FROM courses
      JOIN subscriptions ON subscriptions.courseid = courses.courseid
      WHERE userid = $1 AND subscriptions.status = 'inprogress'
      ORDER BY subscriptiondate ASC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User were not learning to any course yet." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the data" });
  }
});

//===========Get only user completed
courseRouter.get("/user/:id/completed", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT courses.courseid, courses.coursename, courses.description, courses.coursesummary,
      courses.courselearningtime, subscriptions.subscriptiondate, subscriptions.status, courses.imagefile
      FROM courses
      JOIN subscriptions ON subscriptions.courseid = courses.courseid
      WHERE userid = $1 AND subscriptions.status = 'completed'
      ORDER BY subscriptiondate ASC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User were not completed to any course yet." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the data" });
  }
});

//============Count inprogress and completed course each user
courseRouter.get("/user/:id/count", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT 
      COUNT(CASE WHEN subscriptions.status = 'inprogress' THEN 1 END) AS inprogress_count,
      COUNT(CASE WHEN subscriptions.status = 'completed' THEN 1 END) AS completed_count
      FROM courses
      JOIN subscriptions ON subscriptions.courseid = courses.courseid
      WHERE userid = $1;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Count complete." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the data" });
  }
});

//=============Get all user subscribed
courseRouter.get("/user/:id/subscribed", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT courses.courseid, courses.coursename, courses.description, courses.coursesummary,
      courses.courselearningtime, subscriptions.subscriptiondate, courses.imagefile
      FROM courses
      JOIN subscriptions ON subscriptions.courseid = courses.courseid
      WHERE userid = $1
      ORDER BY subscriptiondate ASC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User were not subscribed to any course yet." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the profile" });
  }
});

//========Post user subscribe
courseRouter.post("/:userid/:id/subscribe", async (req, res) => {
  const subscribe = {
    ...req.body,
    subscriptiondate: new Date(),
  };
  const courseId = req.params.id;
  const userId = req.params.userid;
  try {
    // Insert subscription and corresponding submissions
    await connectionPool.query(
      `WITH newUser AS (
    INSERT INTO subscriptions (userid, courseid, subscriptiondate)
    VALUES ($1, $2, $3)
    RETURNING userid, courseid
    )
    INSERT INTO submissions (assignmentid, userid, submissiondate, status, grade, answer)
    SELECT a.assignmentid, newUser.userid, NULL, 'Pending', NULL, NULL
    FROM newUser
    JOIN assignments a ON a.courseid = newUser.courseid
    WHERE newUser.courseid = $2;`,
      [userId, courseId, subscribe.subscriptiondate]
    );
  } catch {
    return res.status(400).json({
      message:
        "Server could not post subscribe because there are missing data from client",
    });
  }
  return res.status(201).json({
    message: "Subscribe created successfully",
  });
});

courseRouter.get("/desire", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(
      `select courses.coursename, courses.description,courses.price,
       courses.coursesummary, courses.courselearningtime, courses.videofile, 
       courses.imagefile, courses.pdffile, desirecourses.courseid
      from courses
      inner join desirecourses on courses.courseid = desirecourses.courseid`
    );
    res.status(200).json(result.rows);
  } catch {
    res.status(500).json({ message: `Internal server error` });
  }
});

//===========Post
courseRouter.post("/:userid/:id/desire", async (req, res) => {
  const desire = {
    ...req.body,
    desiredate: new Date(),
  };
  const courseId = req.params.id;
  const userId = req.params.userid;
  try {
    await connectionPool.query(
      `insert into desirecourses (userid, courseid, desiredate)
      values ($1, $2, $3)`,
      [userId, courseId, desire.desiredate]
    );
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:
        "Server could not post desire because there are missing data from client",
    });
  }
  return res.status(201).json({
    message: "Desire created successfully",
  });
});

courseRouter.get("/:courseid", async (req, res) => {
  const coursesId = req.params.courseid;
  let result;
  try {
    result = await connectionPool.query(
      `select courses.*, modules.* 
       from modules
       inner join courses
       on modules.courseid = courses.courseid
       where modules.courseid = $1`,
      [coursesId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read course because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested course",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

courseRouter.get("/modules/:courseid", async (req, res) => {
  const coursesId = req.params.courseid;
  let result;
  try {
    result = await connectionPool.query(
      `select modules.*, sublesson.*
       from modules
       inner join sublesson 
       on modules.moduleid = sublesson.moduleid
       where modules.courseid = $1
       order by modules.moduleid asc`,
      [coursesId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read course because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested course",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

//*Add course admin*//

courseRouter.post("/", async (req, res) => {
  const {
    coursename,
    price,
    description,
    coursesummary,
    courselearningtime,
    videofile,
    imagefile,
    pdffile,
  } = req.body;

  try {
    if (!coursename || !price || !courselearningtime) {
      return res.status(400).json({
        message:
          "Missing required fields: coursename, price, or courselearningtime.",
      });
    }

    const result = await connectionPool.query(
      `
        INSERT INTO courses (coursename, price, description, coursesummary, courselearningtime, videofile, imagefile, pdffile)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
      [
        coursename,
        price,
        description,
        coursesummary,
        courselearningtime,
        videofile,
        imagefile,
        pdffile,
      ]
    );

    /*if (result.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }*/

    return res
      .status(201)
      .json({ message: "Created course successful", data: result.rows });
  } catch (error) {
    console.error("Database error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
courseRouter.delete("/desire/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    await connectionPool.query(
      `delete from desirecourses
      where courseid=$1`,
      [courseId]
    );
  } catch {
    return res.status(500).json({
      message:
        "Server could not delete desire content because database connection",
    });
  }
  return res.status(201).json({
    message: "Deleted desire sucessfully",
  });
});

/**Delete course admin */

courseRouter.delete("/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    const result = await connectionPool.query(
      `
      DELETE FROM courses WHERE courseid = $1
      `,
      [courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json({
      message: "Deleted course successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

/*Edit course*/
courseRouter.put("/:id", async (req, res) => {
  const courseIdFromClient = req.params.id;

  const {
    coursename,
    description,
    price,
    coursesummary,
    courselearningtime,
    videofile,
    imagefile,
    pdffile,
    updateddate,
  } = req.body;

  if (
    !coursename ||
    !description ||
    !price ||
    !coursesummary ||
    !courselearningtime
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("Received update request for course ID:", courseIdFromClient);
    console.log("Request body:", req.body);

    const result = await connectionPool.query(
      `UPDATE courses
       SET coursename = $2, 
           description = $3, 
           price = $4, 
           coursesummary = $5,
           courselearningtime = $6,
           videofile = $7,
           imagefile = $8,
           pdffile = $9,
           updateddate = $10
       WHERE courseid = $1`,
      [
        courseIdFromClient,
        coursename,
        description,
        price,
        coursesummary,
        courselearningtime,
        videofile,
        imagefile,
        pdffile,
        new Date(), // Add the updated date here
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Courses list table
courseRouter.get("/list/:id", async (req, res) => {
  const coursesId = req.params.id;
  let result;
  try {
    result = await connectionPool.query(
      `select * from courses
      where courseid=$1`,
      [coursesId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read course because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested course",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

export default courseRouter;
