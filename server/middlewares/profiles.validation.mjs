import connectionPool from "../utils/db.mjs";

const updateProfileValidation = async (req, res, next) => {
  const { fullname, educationalbackground, email } = req.body;

  if (!fullname || !educationalbackground || !email) {
    return res.status(400).json({
      message: "Fullname, educational background, and email cannot be empty",
    });
  }

  //===========Check if email exist
  // const { rows } = await connectionPool.query(
  //   `select * from users where email = $1`,
  //   [req.body.email]
  // );
  // if (rows.length > 0) {
  //   return res.status(409).json({ message: "Email already exists" });
  // }

  next();
};

export default updateProfileValidation;
