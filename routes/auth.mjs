import express from "express";
const router = new express.Router();
import { client } from "../mongodb.mjs";
const usersCollection = client.db("cruddb").collection("users");
import jwt from "jsonwebtoken";
import { stringToHash, varifyHash, validateHash } from "bcrypt-inzi";

router.post("/login", async (req, res, next) => {
  if (!req.body?.email || !req.body?.password) {
    res.status(403);
    res.send(`required parameters missing, 
                example request body:
                {
                    title: "abc post title",
                    text: "some post text"
                } `);
    return;
  }
  req.body.email = req.body.email.toLowerCase();
  try {
    let result = await usersCollection.findOne({ email: req.body.email });
    console.log("result: ", result);

    if (!result) {
      // user not found

      res.status(401).send({
        message: "password or email incorrect",
      });
      return;
    } else {
      // user found
      const isMatch = await varifyHash(req.body.password, result.password);

      if (isMatch) {
        const token = jwt.sign({
          isAdmin: false,
          firstName: result.firstName,
          lastName: result.lastName,
          email: req.body.email
        }, process.env.SECRET,{expiresIn: '24h'});

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
        });
        res.send({
          message: "login successfully",
        });
        return;
      } else {
        res.status(401).send({
          message: "password or email incorrect",
        });
        return;
      }
    }
  } catch (error) {
    console.log("error getting data mongodb", error);
    res.status(500).send("server error, pleas try later");
  }
});

router.post("/signup", async (req, res, next) => {
  if (
    !req.body?.firstName ||
    !req.body?.lastName ||
    !req.body?.email ||
    !req.body?.password
  ) {
    res.status(403);
    res.send(`required parameters missing, 
                example request body:
                {
                    firstName: firstName
                    lastName: lastName
                    email: abc@email.com
                    password: password
                } `);
    return;
  }
  req.body.email = req.body.email.toLowerCase();
  try {
    let result = await usersCollection.findOne({ email: req.body.email });
    console.log("results: ", result);

    if (!result) {
      const passwordHash = await stringToHash(req.body.password);

      const insertResponse = await usersCollection.insertOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash,
        createdOn: new Date(),
      });
      console.log("insertResponse: ", insertResponse);

      res.send({
        message: "Signup Successfully",
      });
    } else {
      res.status(403).send({
        message: "user already exists",
      });
    }
  } catch (error) {
    console.log("error getting data mongodb", error);
    res.status(500).send("server error, please try later");
  }
});

//     const insertResponse = await col.insertOne({
//         id: nanoid(),
//         title: req.body.title,
//         text: req.body.text,
//         // date: ISODate()
//     });
//     console.log("insertResponse: ", insertResponse);

//     res.send('post created');
// }
// catch (error) {
//   console.log(error);
//   res.send('Error occurred.')
// }

// Logout route
router.get('/logout', async (req, res) => {
  try {
      // Clear the httpOnly cookie by setting an expired date
      res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true });

      res.status(200).send('Logged out successfully');
  } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).send('Server error during logout');
  }
});

export default router;
