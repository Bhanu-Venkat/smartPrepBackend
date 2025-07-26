const jwt = require('jsonwebtoken');

const bypassRoutes = [
    '/api/auth/signup',      // Anonymous route for signup
    '/api/auth/signin',      // Anonymous route for sign-in
    '/api/user/createAdmin',  // Anonymous route for creating a user
    '/api/dashboard/public',  // Example anonymous dashboard API
    '/api/auth/forgot/password',  // Anonymous route for forgot password
    '/api/auth/reset',      // Anonymous route for reset password
    '/api/auth/verify-otp'
];

const verify = (req, res, next) => {
console.log("the bypassRoutes.includes(req.path): ",req.path, bypassRoutes.includes(req.path))
    if (bypassRoutes.includes(req.path)) {
        return next();
    }

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("the decoded value: ",decoded)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = verify;
