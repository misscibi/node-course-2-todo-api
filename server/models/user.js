const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// we need this Schema object to tack on custom methods
// so we need to switch on how we generate the model
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
            required: true,
            trim: true,
            minlength: 1,
            unique: true,
            validate: {
            validator: validator.isEmail,
                message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
            require: true,
            minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// override the toJSON method with this
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();   // convert this user mongoose object to a regular object
                                        // where the regular properties of the object only exist

    return _.pick(userObject, ['_id', 'email']);
};

// Instance methods have access to all the other properties of a single document
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});
    // user.tokens = user.tokens.concat([{access, token}]);

    // let server.js handle the chain promise
    // the returned token will be passed as a success argument to the next .then() call by server.js
    return user.save().then(() => {
        return token;
    });

    // user.save().then(() => {
    //     return token;
    // }).then((token) => {
    //
    // });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    // $pull - remove something if something matches the criteria
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
    // return user.update({
    //     $pull: {
    //         tokens: {
    //             token: token
    //         }
    //     }
    // });
};


// NOT ELEGANT...
// UserSchema.methods.validatePassword = function (password) {
//     var user = this;
//
//     return bcrypt.compare(password, user.password);
// }

// Model method
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// returns a Promise with user
// or error if user doesn't exist
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, response) => {
                if (response) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

// Mongoose middleware
UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

var User = mongoose.model('User', UserSchema);

module.exports = {User};


// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1,
//         unique: true,
//         validate: {
//             validator: validator.isEmail,
//             message: '{VALUE} is not a valid email.'
//         }
//     },
//     password: {
//         type: String,
//         require: true,
//         minlength: 6
//     },
//     tokens: [{
//         access: {
//             type: String,
//             required: true
//         },
//         token: {
//             type: String,
//             required: true
//         }
//     }]
// });

// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1,
//         unique: true,
//         validate: {
//             validator: (value) => {
//                 return validator.isEmail(value);
//             },
//             message: '{VALUE} is not a valid email.'
//         }
//     },
//     password: {
//
//     },
//     tokens: [{
//
//     }]
// });
