const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];
// const todos = [{
//     text: 'First test todo'
// }, {
//     text: 'Second test todo'
// }];

// before every single test case, every it
// this is going to execute every function contained in the arrow function before each test case
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos, (error) => {
            if (error) {
                return done(error);
            }
        });
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'First test todo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => done(error));
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});