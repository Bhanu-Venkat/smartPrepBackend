const User = require('../models/user');
const { hashPassword } = require('../utils/passwordUtils');

// Create a new user (Admin-only)
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, emailId, phonenumber, gender, dateOfBirth, age, role, school, class: userClass, affiliation, password } = req.body;
        
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await hashPassword(password || 'defaultPassword123');
        const user = await User.create({
            firstName,
            lastName,
            emailId,
            phonenumber,
            gender,
            dateOfBirth,
            age,
            role,
            school,
            class: userClass,
            affiliation,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const filters = req.query; // Example: ?role=Student
        const users = await User.find(filters);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Hash password if it's being updated
        if (updatedData.password) {
            updatedData.password = await hashPassword(updatedData.password);
        }

        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

const createAdmin = async (req, res) =>{
    try {
        const { username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await User.create({username, password: hashedPassword, role: 'Admin'});
        res.status(201).json({message: 'Admin created successfully', user})
    } catch (error) {
        res.status(500).json({message: 'error while creating Admin', error: error.message})
    }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, createAdmin };
