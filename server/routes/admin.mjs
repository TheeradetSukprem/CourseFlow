import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import adminLoginValidation from "../middlewares/adminlogin.validation.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminRouter = Router();

adminRouter.post("/login", [adminLoginValidation], async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await connectionPool.query(
      `select * from users where email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email does not exist." });
    }

    const user = rows[0];

    if (user.role.toLowerCase() !== "admin") {
      return res.status(401).json({ message: "Only admin can access" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      { id: user.userid, email: user.email, role: user.role },
      secretKey,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

adminRouter.get("/assignments/list", async (req, res) => {
  try {
    const result = await connectionPool.query(
      `select coursename, assignments.title, assignments.description,modulename,sublessonname,assignments.createddate, assignments.assignmentid
        from assignments
        inner join courses on courses.courseid = assignments.courseid
        inner join modules on modules.moduleid = assignments.moduleid
        inner join sublesson on sublesson.sublessonid = assignments.sublessonid
        `
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching assignments:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Lesson
adminRouter.post("/:courseid/lesson", async (req, res) => {
  const sublessondate = new Date();

  let newModule;
  const courseId = req.params.courseid;
  try {
    newModule = await connectionPool.query(
      `insert into modules (courseid, modulename) values ($1,$2) 
      returning *`,
      [courseId, req.body.modulename]
    );
    console.log(req.body);
    req.body.sublessonname.forEach(async (value, i) => {
      try {
        await connectionPool.query(
          `
          insert into sublesson (moduleid, sublessonname, videofile, sublessondate)
          values ($1,$2, $3, $4)
          `,
          [newModule.rows[0].moduleid, value, req.body.videos[i], sublessondate]
        );
      } catch (error) {
        console.log(error);
      }
    });
    return res.status(201).json({
      message: "Lesson created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:
        "Server could not created lesson because there are missing data from client",
    });
  }
});

adminRouter.get("/lesson", async (req, res) => {
  try {
    const result = await connectionPool.query(`SELECT * FROM modules `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching sublesson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.get("/lesson/:id", async (req, res) => {
  const lessonId = req.params.id;
  let result;
  try {
    result = await connectionPool.query(
      `select * from modules
      where moduleid=$1 `,
      [lessonId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read lesson because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested lesson",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

adminRouter.delete("/lesson/:id", async (req, res) => {
  const lessonId = req.params.id;
  try {
    await connectionPool.query(
      `delete from modules
      where moduleid=$1`,
      [lessonId]
    );
    await connectionPool.query(
      `delete from sublesson
      where moduleid=$1`,
      [lessonId]
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server could not delete lesson because database connection",
    });
  }
  return res.status(201).json({
    message: "Deleted lesson sucessfully",
  });
});

//sublesson
adminRouter.get("/sublesson", async (req, res) => {
  try {
    const result = await connectionPool.query(`SELECT * FROM sublesson`);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching sublesson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.delete("/sublesson/:id", async (req, res) => {
  const sublessonId = req.params.id;
  try {
    await connectionPool.query(
      `delete from sublesson
      where sublessonid=$1`,
      [sublessonId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not delete sublesson because database connection",
    });
  }
  return res.status(201).json({
    message: "Deleted sublesson sucessfully",
  });
});

adminRouter.put("/sublesson/:lessonid", async (req, res) => {
  const lessonId = req.params.lessonid;
  const editLesson = req.body[0];
  const editSublesson = req.body[1];
  const video = req.body[2];
  console.log(video);
  try {
    await connectionPool.query(
      `update modules
      set modulename=$2
      where moduleid=$1
      returning *`,
      [lessonId, editLesson.modulename]
    );
    editSublesson.forEach(async (value, i) => {
      console.log(value);
      try {
        await connectionPool.query(
          `insert into sublesson (sublessonid, moduleid, sublessonname, videofile, sublessondate)
           values ($1, $2, $3, $4, $5)
           ON CONFLICT (sublessonid) DO UPDATE SET
           moduleid=EXCLUDED.moduleid,
           sublessonname=EXCLUDED.sublessonname,
           videofile=EXCLUDED.videofile,
           sublessondate=EXCLUDED.sublessondate `,

          [
            value.sublessonid,
            lessonId,
            value.sublessonname,
            video[i],
            value.sublessondate,
          ]
        );
      } catch (error) {
        console.log(error);
      }
    });
  } catch {
    return res.status(500).json({
      message: "Server could not put sublesson because database connection",
    });
  }
  return res.status(201).json({
    message: "Put sublesson sucessfully",
  });
});

adminRouter.post("/sublesson/:lessonid", async (req, res) => {
  const lessonId = req.params.lessonid;
  let editLesson;
  try {
    editLesson = await connectionPool.query(
      `insert into sublesson (moduleid, sublessonname, videofile, sublessondate)
      values ($1, $2, $3, $4) returning *`,
      [lessonId, "", "", new Date()]
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "Server could not reserved sublesson because database connection",
    });
  }
  return res.status(201).json({
    message: "Reserved sublesson sucessfully",
    data: editLesson.rows[0],
  });
});

adminRouter.put("/sublessondrag/:lessonid", async (req, res) => {
  const lessonId = req.params.lessonid;
  const editSublesson = req.body[0];
  console.log(editSublesson);

  editSublesson.forEach(async (value, i) => {
    console.log(value);
    try {
      await connectionPool.query(
        `update sublesson 
         set sublessonorder=$1 where sublessonid=$2 `,
        [i, value.sublessonid]
      );
    } catch (error) {
      console.log(error);
    }
  });
  return res.status(201).json({
    message: "Put sublessondrag sucessfully",
  });
});

adminRouter.get("/sublesson/:lessonid", async (req, res) => {
  const LessonId = req.params.lessonid;
  let result;
  try {
    result = await connectionPool.query(
      `select * from sublesson
      where moduleid=$1
      order by sublessonorder asc `,
      [LessonId]
    );
  } catch {
    return res.status(500).json({
      message: "Server could not read lesson because database connection",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find a requested lesson",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

//*get assignment all//
adminRouter.get("/assignments", async (req, res) => {
  try {
    const result = await connectionPool.query(`
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
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching assignments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//*post assignments(add)*/Tao/
adminRouter.post("/assignments", async (req, res) => {
  const { course, lesson, sub_lesson, title } = req.body;
  if (!course || !lesson || !sub_lesson || !title) {
    return res
      .status(400)
      .json({ error: "All fields except due date are required" });
  }

  try {
    await connectionPool.query("BEGIN");

    // Insert assignment and capture the assignmentid
    const { rows: assignmentRows } = await connectionPool.query(
      `WITH inserted_assignment AS (
        INSERT INTO assignments (courseid, moduleid, sublessonid, title)
        VALUES ($1, $2, $3, $4)
        RETURNING assignmentid, sublessonid
      )
      UPDATE sublesson
      SET assignmentid = ia.assignmentid
      FROM inserted_assignment ia
      WHERE sublesson.sublessonid = ia.sublessonid
      RETURNING ia.assignmentid`,
      [course, lesson, sub_lesson, title]
    );

    const assignmentId = assignmentRows[0].assignmentid;

    // Fetch all user IDs
    const { rows: users } = await connectionPool.query(
      `SELECT userid FROM users`
    );

    // Insert a submission for each user
    for (const user of users) {
      await connectionPool.query(
        `INSERT INTO submissions (assignmentid, userid, submissiondate, status, grade, answer)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [assignmentId, user.userid, new Date(), "Pending", null, null]
      );
    }

    await connectionPool.query("COMMIT");

    res
      .status(201)
      .json({ message: "Assignment and submissions created successfully" });
  } catch (error) {
    await connectionPool.query("ROLLBACK");
    console.error("Error occurred while saving the assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//*get assignments by id//
adminRouter.get("/assignment/:id", async (req, res) => {
  const assignmentid = parseInt(req.params.id, 10);

  if (isNaN(assignmentid)) {
    return res.status(400).json({
      message: "Invalid assignment ID",
    });
  }

  try {
    const result = await connectionPool.query(
      `SELECT * FROM assignments WHERE assignmentid = $1`,
      [assignmentid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    return res.status(200).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error occurred while fetching the assignment:", error);
    return res.status(500).json({
      message:
        "Server could not read assignments due to database connection error",
    });
  }
});

//*edit assignments
adminRouter.put("/assignments/:id", async (req, res) => {
  const { id } = req.params;
  const { course, lesson, sub_lesson, title } = req.body;
  if (!course || !lesson || !sub_lesson || !title) {
    return res
      .status(400)
      .json({ error: "All fields except due date are required" });
  }

  try {
    const result = await connectionPool.query(
      `UPDATE assignments
       SET courseid = $1, 
           moduleid = $2, 
           sublessonid = $3, 
           title = $4
       WHERE assignmentid = $5`,
      [course, lesson, sub_lesson, title, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating the assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//*get addsignments by id//
adminRouter.get("/assignments/:id", async (req, res) => {
  const assignmentid = req.params.id;
  let result;

  try {
    result = await connectionPool.query(
      `SELECT * FROM assignments WHERE assignmentid = $1`,
      [assignmentid]
    );
  } catch (error) {
    console.error("Error occurred while fetching the assignment:", error);
    return res.status(500).json({
      message:
        "Server could not read assignments due to database connection error",
    });
  }

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Assignment not found",
    });
  }

  return res.status(200).json({
    data: result.rows[0],
  });
});

//*edit assignments
adminRouter.put("/assignment/:id", async (req, res) => {
  const assignmentid = req.params.id;
  const { course, lesson, sub_lesson, title } = req.body;

  if (!course || !lesson || !sub_lesson || !title) {
    return res
      .status(400)
      .json({ error: "All fields except due date are required" });
  }

  try {
    const result = await connectionPool.query(
      `UPDATE assignments
       SET submoduleid = $1, lessonid = $2, sublessonid = $3, title = $4, duedate = $5
       WHERE assignmentid = $6`,
      [course, lesson, sub_lesson, title, assignmentid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating the assignment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//addLesson and sublesson
adminRouter.post("/:courseid/lesson", async (req, res) => {
  const sublessondate = new Date();

  let newModule;
  const courseId = req.params.courseid;
  try {
    newModule = await connectionPool.query(
      `insert into modules (courseid, modulename) values ($1,$2) 
      returning *`,
      [courseId, req.body.modulename]
    );
    console.log(req.body);
    req.body.sublessonname.forEach(async (value, i) => {
      try {
        await connectionPool.query(
          `
          insert into sublesson (moduleid, sublessonname, videofile, sublessondate)
          values ($1,$2, $3, $4)
          `,
          [newModule.rows[0].moduleid, value, req.body.videos[i], sublessondate]
        );
      } catch (error) {
        console.log(error);
      }
    });

    // await connectionPool.query(
    //   `
    //   with lesson as (
    //   insert into modules (courseid, modulename) values ($1,$2)
    //   returning *)
    //   insert into sublesson (moduleid, sublessonname, videofile, sublessondate)
    //   select lesson.moduleid, $3, $4, $5 from lesson
    //   `,
    //   [
    //     courseId,
    //     lesson.modulename,
    //     lesson.sublessonname,
    //     lesson.videofile,
    //     lesson.sublessondate,
    //   ]
    // );
    return res.status(201).json({
      message: "Lesson created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:
        "Server could not created lesson because there are missing data from client",
    });
  }
});

//Delete assignments
adminRouter.delete("/assignments/:id", async (req, res) => {
  const assignmentId = req.params.id;

  try {
    await connectionPool.query("BEGIN");

    const result = await connectionPool.query(
      `DELETE FROM assignments WHERE assignmentid = $1`,
      [assignmentId]
    );

    if (result.rowCount === 0) {
      await connectionPool.query("ROLLBACK");
      return res.status(404).json({ error: "Assignment not found" });
    }

    await connectionPool.query(
      `UPDATE sublesson SET assignmentid = NULL WHERE assignmentid = $1`,
      [assignmentId]
    );

    await connectionPool.query(
      `DELETE FROM submissions WHERE assignmentid = $1`,
      [assignmentId]
    );

    await connectionPool.query("COMMIT");
    return res.status(200).json({
      message:
        "Deleted assignment, cleared related assignment ID in sublesson, and deleted related submissions successfully",
    });
  } catch (error) {
    await connectionPool.query("ROLLBACK");
    console.error("Error deleting assignment:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//Get Sub lesson list with module id
adminRouter.get("/sublessonlist/:id", async (req, res) => {
  const courseid = req.params.id;
  console.log(courseid);
  try {
    const result = await connectionPool.query(
      `SELECT 
      modules.modulename,
		  modules.moduleid,
		  modules.courseid,
	    modules.moduleorder,
      COUNT(sublesson.moduleid) AS Count_sublesson
      FROM courses
      INNER JOIN modules USING (courseid)
      JOIN sublesson USING (moduleid)
	    where courseid = $1
      GROUP BY modules.modulename, modules.moduleid
      order by modules.moduleorder asc
      `,
      [courseid]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error occurred while fetching lesson and sublesson:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.put("/moduleorderlist/:id", async (req, res) => {
  const editmodule = [...req.body];
  const courseid = req.params.id;
  console.log(editmodule);
  console.log(courseid);
  try {
    editmodule.forEach((value, index) => {
      console.log(value.moduleid);
      connectionPool.query(
        `update modules set moduleorder = $1 where moduleid = $2`,
        [index, value.moduleid]
      );
    });
  } catch (error) {
    console.error("Error occurred while fetching lesson and sublesson:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  return res.status(200).json({ message: "edit complete" });
});

//get lesson by courseid
adminRouter.get("/:courseid/lesson", async (req, res) => {
  const courseId = req.params.courseid;
  let result;
  try {
    result = await connectionPool.query(
      `SELECT courseid, modulename,moduleid FROM modules WHERE courseid =$1`,
      [courseId]
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message:
        "Server could not read course ID from lesson because of a database connection error",
    });
  }
  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Server could not find a requested course ID lesson",
    });
  }
  return res.status(200).json({
    data: result.rows,
  });
});

export default adminRouter;
