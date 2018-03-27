const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}) - remove EVERYTHING from the collection
// we only receive the number of docs that were removed
// but not the objects themselves
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findOneAndRemove({_id: 'sfsdfdsf'}).then((todo) => {
//
// });

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('5ab33b92b9fa5e85f4fc592ca').then((todo) => {
    console.log(todo);
}).catch((error) => console.log(error.message));