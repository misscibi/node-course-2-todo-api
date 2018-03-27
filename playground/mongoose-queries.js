const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5ab082fb0b849b0b507c47dde';
// var id = '5ab14b1384ac6c7a04ca65ab';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// // returns an array of objects
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });
//
// // returns 1 object only
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });
//
// // uses the _id property, catch error if id is not an objectId
// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found.');
//     }
//     console.log('Todo by Id', todo);
// }).catch((error) => console.log(error));

// User.findById(id).then((user) => {
//     if (!user) {
//         return console.log('Unable to find user with given id.');
//     }
//     console.log('User by Id', JSON.stringify(user, undefined, 2));
//     // console.log('User by Id', user);
// }, (error) => {
//     console.log(error);
// });

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Unable to find user with given id.');
    }
    console.log('User by Id', JSON.stringify(user, undefined, 2));
    // console.log('User by Id', user);
}).catch((error) => console.log(error));