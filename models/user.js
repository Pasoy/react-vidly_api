const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            isAdmin: this.isAdmin
        },
        config.get('jwtPrivateKey')
    );
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        username: Joi.string()
            .min(2)
            .max(50)
            .required(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required()
    };

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
