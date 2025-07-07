const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { generatePassword, hashPassword } = require('../utils/passwordUtils');
const sendEmail = require('../config/email');
const bcrypt = require('bcrypt');

const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        console.log("the user data: ",user)
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("thr password match: ",isMatch)
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.status(200).json({ token, user, message: 'Signin successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const signup = async (req, res) => {
    const { parent, students } = req.body;

    try {
        // Create Parent
        const isParentExist = await checkUserExistance(parent.emailId);
        const isStudentsExists = await Promise.all(students.map(async (student) => {
            if(student.emailId){
                return await checkUserExistance(student.emailId);
            }else{
                return false
            }}));
        if(isParentExist || isStudentsExists.includes(true)){
            return res.status(400).json({ message: 'Parent or student already exists' });
        }
        const parentUsername = await generateUniqueUsername(parent.firstName, parent.lastName, null);
        const parentPassword = generatePassword();
        const hashedParentPassword = await hashPassword(parentPassword);

        const parentUser = await User.create({
            ...parent,
            username: parentUsername,
            password: hashedParentPassword,
            role: 'Parent',
        });

        // Create Students
        const studentUsers = [];
        const mailContent = [];
        for (const student of students) {
            const studentUsername = await generateUniqueUsername(student.firstName, student.lastName, student.dateOfBirth);
            const studentPassword = generatePassword();
            const hashedStudentPassword = await hashPassword(studentPassword);
            
            const studentUser = await User.create({
                ...student,
                username: studentUsername,
                password: hashedStudentPassword,
                role: 'Student',
                parent: parentUser._id, // Link parent to student
            });

            studentUsers.push(studentUser);
            mailContent.push({ name: student.firstName, username: studentUsername, password: studentPassword });

            // Send email to student
            student.emailId && await sendEmail(student.emailId, '<p>Welcome to EduTech', `Hello ${student.firstName}, your username is ${studentUsername} and your password is ${studentPassword}</p>`);
        }

        var parentMailBody = `<p>Hello ${parent.firstName}, your username is ${parentUsername} and your password is ${parentPassword}</p>`;
         var studentMailBody = mailContent.map((student) => `<p>your kids username and password details:  ${student.name}'s username is ${student.username} and your password is ${student.password}</p>`).join('\n');

        // Send email to parent
        await sendEmail(parent.emailId, 'Welcome to EduTech' , `<p>${parentMailBody} ${studentMailBody}</p>`);

        res.status(201).json({ message: 'Users created successfully', parent: parentUser, students: studentUsers });
    } catch (error) {
        console.log("the erorr: ",error)
        res.status(500).json({ message: 'Error creating users', error: error.message });
    }
};

const checkUserExistance = async (emailId) => {
    const user = await User.findOne({ emailId });
    if(user){
        return true;
    }else{
        return false;
    }
        
}

const generateUniqueUsername = async (firstName, lastName, dateOfBirth) => {
    let baseUsername = `${firstName}${lastName}`.toLowerCase();
    let username = baseUsername;
    let count = 1;
    while (await User.findOne({ username })) {
        username = dateOfBirth ? `${baseUsername}${new Date(dateOfBirth).getFullYear()}` : `${baseUsername}${count}`;
        count++;
    }

    return username;
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { emailId } = req.body;
        console.log("the emailId: ",emailId)

        const user = await User.findOne({ emailId });
        console.log("the use rdata: ",user)
        if (!user) {
            return res.status(400).json({ message: 'Email not registered' });
        }

        // Generate OTP and hash it
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await hashPassword(otp)

        // Save hashed OTP as password temporarily
        await User.findByIdAndUpdate(user._id, { password: hashedOtp });

        // Send OTP via email
        await sendEmail(emailId, 'Password Reset OTP', `<p>Your OTP for password reset is: ${otp}</p>`);

        res.status(200).json({ message: 'Please check your email for OTP' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { emailId, otp, newPassword } = req.body;

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Validate OTP
        const isMatch = await bcrypt.compare(otp, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect OTP' });
        }

        // Hash new password and update user
        const hashedPassword = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        await sendEmail(emailId, 'Successfully reset the password', `<p>You have successfully reset the password.</p>`);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};


module.exports = { signin,
    signup,
    forgotPassword,
    resetPassword,
 };
