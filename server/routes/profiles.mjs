import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import updateProfileValidation from "../middlewares/profiles.validation.mjs";

//=================Get User Profile

const profileRouter = Router();

//=================Get All User profiles
profileRouter.get("/", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(
      `SELECT profileid, profilepicture, fullname, educationalbackground, email, age
       FROM profiles
       JOIN users ON users.userid = profiles.userid
       ORDER BY profileid ASC`
    );
    res.status(200).json(result.rows);
  } catch {
    res.status(500).json({ message: `Internal Server Error` });
  }
});

//================Get profile by id
profileRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query(
      `SELECT profiles.profileid, profiles.profilepicture, users.userid, users.fullname, users.educationalbackground, users.email, users.age
       FROM users
       JOIN profiles ON users.userid = profiles.userid
       WHERE users.userid = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the profile" });
  }
});

//===============update profile
profileRouter.put(
  "/:id/update",
  [updateProfileValidation],
  async (req, res) => {
    const { id } = req.params;
    const { profilepicture, fullname, educationalbackground, email, age } =
      req.body;
    try {
      // Start a transaction
      await connectionPool.query("BEGIN");

      // Update profile picture in profiles table
      const updateProfileQuery = `UPDATE profiles SET profilepicture = $1 WHERE profileid = $2 RETURNING *`;
      const updateProfileValues = [profilepicture, id];
      const profileResult = await connectionPool.query(
        updateProfileQuery,
        updateProfileValues
      );

      if (profileResult.rows.length === 0) {
        await connectionPool.query("ROLLBACK");
        return res.status(404).json({ message: "Profile not found" });
      }

      // Update user information in users table
      const updateUserQuery = `UPDATE users SET fullname = $1, educationalbackground = $2, email = $3, age = $4 WHERE userid = (SELECT userid FROM profiles WHERE profileid = $5) RETURNING *`;

      const updateUserValues = [
        fullname,
        educationalbackground,
        email,
        age,
        id,
      ];
      const userResult = await connectionPool.query(
        updateUserQuery,
        updateUserValues
      );

      if (userResult.rows.length === 0) {
        await connectionPool.query("ROLLBACK");
        return res.status(404).json({ message: "User not found" });
      }

      // Commit the transaction
      await connectionPool.query("COMMIT");

      res.status(200).json({
        message: "Update profile successful and User information has updated",
        profile: profileResult.rows[0],
        user: userResult.rows[0],
      });
    } catch (error) {
      // Rollback the transaction in case of error
      await connectionPool.query("ROLLBACK");
      console.error(error);
      res.status(500).json({ message: `Internal Server Error` });
    }
  }
);

//===============(Test) add proflie
profileRouter.post("/add", async (req, res) => {
  const { profileid, userid, profilepicture } = req.body;

  try {
    const result = await connectionPool.query(
      `INSERT INTO profiles (profileid, userid, profilepicture) VALUES ($1, $2, $3) RETURNING *`,
      [profileid, userid, profilepicture]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the profile" });
  }
});

export default profileRouter;
