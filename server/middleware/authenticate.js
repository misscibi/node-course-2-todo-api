var {User} = require('./../models/user');

// middleware for private routes
var authenticate = (request, response, next) => {
    var token = request.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        // response.send(user);
        request.user = user;
        request.token = token;
        // need to execute next() or else
        // the code after authenticate function will not fire
        next();
    }).catch((error) => {
        // catch the rejected Promise when then() does not fire
        response.status(401).send();
    });
};

module.exports = {authenticate};