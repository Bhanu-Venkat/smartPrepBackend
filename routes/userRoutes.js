const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser, createAdmin, getChildrenByParentId } = require('../controllers/userController');
const verifyJWT = require('../utils/authMiddleware');

const router = express.Router();

// Apply JWT middleware globally to protect all routes except those defined as public
// router.use(verifyJWT);

// CRUD APIs
router.post('/', createUser);            // Create a new user
router.get('/', getUsers);              // Get all users
router.get('/:id', getUserById);        // Get user by ID
router.put('/:id', updateUser);         // Update user by ID
router.delete('/:id', deleteUser);      // Delete user by ID
router.post('/createAdmin', createAdmin); // Create an admin user
// GET /getChildren/:parentID
router.get('/getChildren/:parentID', getChildrenByParentId);

module.exports = router;
