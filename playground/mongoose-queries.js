const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5ab082fb0b849b0b507c47dd';
// var id = '5ab14b1384ac6c7a04ca65ab';

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
// // uses the _id property
// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found.');
//     }
//     console.log('Todo by Id', todo);
// });

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Id not found.');
    }
    console.log('User by Id', JSON.stringify(user, undefined, 2);
}), (error) => {
    console.log(error);
};