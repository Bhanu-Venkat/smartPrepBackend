const bcrypt = require('bcrypt');

const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!';
    return Array(10).fill('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

module.exports = { generatePassword, hashPassword };
