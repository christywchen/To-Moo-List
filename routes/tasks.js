const express = require('express');
const { validationResult } = require('express-validator');
const db = require('../db/models');
const { csrfProtection, asyncHandler, userValidators, loginValidator } = require('../utils');

const router = express.Router();

//router get
router.get('/tasks/:id(\\d+)', )