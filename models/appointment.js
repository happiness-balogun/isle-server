var mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const confiq = require("../config/config").get(process.env.NODE_ENV);
const salt = 10;
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  Id: {
    type: Number,
    required: true,
    maxlength: 100,
  },
  Subject: {
    type: String,
    required: true,
    maxlength: 100,
  },
  StartTime: {
    type: String,
    required: true,
    maxlength: 100,
  },
  EndTime: {
    type: String,
    required: true,
    maxlength: 100,
  },
  IsAllDay: {
    type: Boolean,
    required: true,
  },
  IsBlock: {
    type: Boolean,
    required: true,
  },
  IsReadonly: {
    type: Boolean,
    required: true,
  },
  RoomId: {
    type: Number,
    required: true,
    maxlength: 100,
  },
  ResourceId: {
    type: Number,
    required: true,
    maxlength: 100,
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
