const express = require("express");
const { loginUser } = require("../controllers/auth");

const router = express.Router();



// AUTHENTICATION
router.post("/login",loginUser);