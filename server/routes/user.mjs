import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import userRegisterValidation from "../middlewares/postuser.validation.mjs";
import userLoginValidation from "../middlewares/userlogin.validation.mjs";
import authenticateJWT from "../middlewares/authentication.mjs";
import jwt from "jsonwebtoken";

const userRouter = Router();

//=================Get all user
userRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(
      `select * from users order by userid asc`
    );
    res.status(200).json(result.rows);
  } catch {
    res.status(500).json({ message: `Internal Server Error` });
  }
});

// Route to get user-specific data using userid from the JWT
userRouter.get("/myprofile", authenticateJWT, async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await connectionPool.query(
      `SELECT * FROM users WHERE userid = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ===============Get user by id
userRouter.get("/:id", async (req, res) => {
  let result;
  const userId = req.params.id;
  try {
    result = await connectionPool.query(
      `SELECT * FROM users WHERE userid = $1`,
      [userId]
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        "Server could not read user because of a database connection error",
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: "Server could not find user",
    });
  }
  return res.status(200).json({
    data: result.rows[0],
  });
});

//===========Register
userRouter.post("/register", [userRegisterValidation], async (req, res) => {
  const newUser = { ...req.body };
  const query = `insert into users (fullname, age, educationalbackground, email, password, role)
                values($1, $2, $3, $4, $5, $6)
                returning *`;
  const values = [
    newUser.fullname,
    newUser.age,
    newUser.educationalbackground,
    newUser.email,
    newUser.password,
    newUser.role,
  ];
  console.log(newUser);
  try {
    // Start a transaction
    await connectionPool.query("BEGIN");

    // Insert new user
    const result = await connectionPool.query(query, values);
    const newUserId = result.rows[0].userid;

    // Insert corresponding profile
    const profileQuery = `insert into profiles (userid, profilepicture)
                          values($1, $2)`;
    const profileValues = [newUserId, ""]; // Assuming an empty string for profilepicture as default
    await connectionPool.query(profileQuery, profileValues);

    // Commit the transaction
    await connectionPool.query("COMMIT");

    return res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    // Rollback the transaction in case of error
    await connectionPool.query("ROLLBACK");
    return res.status(500).json({ message: `Internal Server Error` });
  }
});

// user login
userRouter.post("/login", [userLoginValidation], async (req, res) => {
  console.log("SECRET_KEY: ", process.env.SECRET_KEY);
  console.log("Request Body: ", req.body);
  const { email } = req.body;

  try {
    console.log(`Attempting to log in with email: ${email}`);

    const result = await connectionPool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // generate token
    const user = result.rows[0];
    const token = jwt.sign(
      {
        userid: user.userid,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" } // 1d
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//===========Get Course Data
userRouter.get("/courseinfo/:courseid", async (req, res) => {
  const { courseid } = req.params;

  if (!courseid) {
    return res.status(400).send("courseid is required");
  }

  try {
    // Fetch course
    const coursesQuery = "select * from courses where courseid = $1";
    const coursesResult = await connectionPool.query(coursesQuery, [courseid]);
    const courses = coursesResult.rows;

    if (courses.length === 0) {
      return res.status(404).send("Course not found");
    }

    const course = courses[0];

    // Fetch modules
    const modulesQuery = "select * from modules where courseid = $1";
    const modulesResult = await connectionPool.query(modulesQuery, [courseid]);
    const modules = modulesResult.rows;

    // Fetch sublessons
    const sublessonsQuery = `
  SELECT * FROM sublesson 
  WHERE moduleid IN (SELECT moduleid FROM modules WHERE courseid = $1)
`;
    const sublessonsResult = await connectionPool.query(sublessonsQuery, [
      courseid,
    ]);
    const sublessons = sublessonsResult.rows;

    // Structure the data
    const sidebarData = {
      courseid: course.courseid,
      coursename: course.coursename,
      coursedescription: course.description,
      modules: modules.map((module) => {
        return {
          moduleid: module.moduleid,
          modulename: module.modulename,
          sublessons: sublessons
            .filter((sublesson) => sublesson.moduleid === module.moduleid)
            .map((sublesson) => {
              return {
                sublessonid: sublesson.sublessonid,
                sublessonname: sublesson.sublessonname,
                assignmentid: sublesson.assignmentid,
                videofile: sublesson.videofile,
                sublessondate: sublesson.sublessondate,
              };
            }),
        };
      }),
    };

    res.json(sidebarData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//===========Get Assignment Data
userRouter.get("/assignment/:assignmentid", async (req, res) => {
  const { assignmentid } = req.params;

  try {
    const query = "SELECT * FROM assignments WHERE assignmentid = $1";
    const value = [assignmentid];
    const result = await connectionPool.query(query, value);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignment found for the given assignment ID" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching assignment data: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
