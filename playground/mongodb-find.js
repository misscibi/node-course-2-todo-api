// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID("5ab0822e922a425ee4fb4994")
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Users').find({
    //     name: 'Link',
    // }).count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (error) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({
        name: 'Link',
    }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (error) => {
        console.log('Unable to fetch users', error);
    });

    client.close();
});