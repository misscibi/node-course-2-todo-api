// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// Object destructuring - ES6 only feature
// var user = {name: 'link', age: 18};
// var {name} = user;
// console.log(name);

// New database but there is no record in the GUI unless new data is added
// MongoDB module v2
// MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
//     if (error) {
//         return console.log('Unable to connect to MongoDB server');
//     }
//     console.log('Connected to MongoDB server');
//
//     db.collection('Todos').insertOne({
//         text: 'Something to do',
//         completed: false
//     }, (error, result) => {
//         if (error) {
//             return console.log('Unable to insert todo', error);
//         }
//
//         console.log(JSON.stringify(result.ops, undefined, 2));
//     });
//
//     db.close();
// });

// MongoDB module v3
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert todo', error);
    //     }
    //
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into Users (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Link',
    //     age: 18,
    //     location: 'Hyrule'
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user', error);
    //     }
    //
    //     // result.ops - array of all the documents for the collection
    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    client.close();
});