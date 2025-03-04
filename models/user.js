const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String },
    username: {type: String,},
    emailId: { type: String, default: undefined, unique: true, sparse: true },
    phonenumber: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dateOfBirth: { type: Date },
    role: { type: String, enum: ['Student', 'Teacher', 'Admin', 'Parent'] },
    school: { type: String },
    class: { type: String },
    affiliation: { type: String },
    password: { type: String },
    parent: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

// Pre-save hook to hash password before saving
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

userSchema.virtual('calculatedAge').get(function () {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

module.exports = mongoose.model('User', userSchema);
