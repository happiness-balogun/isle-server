const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/config").get(process.env.NODE_ENV);
const User = require("./models/user");
const Appointment = require("./models/appointment");
const { auth } = require("./middlewares/auth");

const app = express();
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());
app.use(cors());

// database connection
mongoose.Promise = global.Promise;

mongoose.connect(
  db.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) console.log("err", err);
    console.log("database is connected");
  }
);

// adding new user (sign-up route)
app.post("/api/register", function (req, res) {
  // taking a user
  const newuser = new User(req.body);
  console.log("newuser", newuser, newuser.data);

  if (newuser.password !== newuser.password2)
    return res.status(400).json({ message: "password doesn't not match" });

  User.findOne({ email: newuser.email }, function (err, user) {
    if (user)
      return res
        .status(400)
        .json({ auth: false, message: "email already exits" });

    newuser.save((err, doc) => {
      if (err) {
        console.log("err", err);
        return res.status(400).json({ success: false });
      } else {
        res.status(200).json({
          succes: true,
          user: doc,
        });
      }
      //   res.status(200).json({
      //     succes: true,
      //     user: doc,
      //   });
    });
  });
});

// login user
app.post("/api/login", function (req, res) {
  let token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user)
      return res.status(400).json({
        error: true,
        message: "You are already logged in",
      });
    else {
      User.findOne({ username: req.body.username }, function (err, user) {
        console.log("Login Request - ", req.body);
        if (!user)
          return res.status(400).json({
            isAuth: false,
            message: " Authentication failed ,username not found",
          });

        user.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch)
            return res.json({
              isAuth: false,
              message: "password doesn't match",
            });

          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({
              isAuth: true,
              id: user._id,
              email: user.email,
              username: user.username,
              token: user.token,
            });
          });
        });
      });
    }
  });
});

// get logged in user
app.get("/api/profile", auth, function (req, res) {
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.firstname + " " + req.user.lastname,
    username: req.user.username,
    password: req.user.password,
  });
});

//logout user
app.get("/api/logout", auth, function (req, res) {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.status(200).json({ succes: true });
  });
});

//APPOINTMENTS

//get appointments
app.get("/api/appointments", (req, res, next) => {
  Appointment.find({})
    .then((appointments) => {
      console.log("appointments", appointments);
      res.send(appointments);
    })
    .catch(next);
});

//save appointment
app.post("/api/appointment", (req, res) => {
  const newappointment = new Appointment(req.body);

  console.log("save-appointment", newappointment, req, res);
  Appointment.create(req.body).then((newappointment) => {
    res.send(newappointment);
  });
});

// listening port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});
