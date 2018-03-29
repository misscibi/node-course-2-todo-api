const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// const todos = [{
//     text: 'First test todo'
// }, {
//     text: 'Second test todo'
// }];

// before every single test case, every it
// this is going to execute every function contained in the arrow function before each test case
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        // var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                // query database using findById toNotExist
                // expect(null).toNotExist();
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should return a 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        // update text, set completed to true
        // assert: 200
        // assert: text is changed, completed is true, completedAT is a number .toBeA
        var hexId = todos[0]._id.toHexString();
        var todoDelta = {text: 'test suite update', completed: true};

        request(app)
            .patch(`/todos/${hexId}`)
            .send(todoDelta)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todoDelta.text);
                expect(response.body.todo.completed).toBe(todoDelta.completed);
                expect(typeof response.body.todo.completedAt).toBe('number');
            })
            .end((error, response) => {
                if (!error) {
                    return done(error);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(todoDelta.text);
                    expect(todo.completed).toBe(todoDelta.completed);
                    expect(typeof todo.completedAt).toBe('number');
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab id of second todo item
        // update text, set completed to false
        // assert: 200
        // assert: text is changed, completed is false, completedAt is null .toNotExist

        var hexId = todos[1]._id.toHexString();
        var todoDelta = {text: 'test suite update #2', completed: false};

        request(app)
            .patch(`/todos/${hexId}`)
            .send(todoDelta)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todoDelta.text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toBeFalsy();
            })
            .end((error, response) => {
                if (!error) {
                    return done(error);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(todoDelta.text);
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeFalsy();
                    done();
                }).catch((error) => done(error));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                // custom expect function
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((response) => {
                expect(response.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'zelda@hyrule.com';
        var password = 'zeldalikeslink';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toBeTruthy();
                expect(response.body._id).toBeTruthy();
                expect(response.body.email).toBe(email);
            })
            .end((error) => {
                // check the database and make sure the data is there
                if (error) {
                    return done(error);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'ganondorf.com';
        var password = 'ganon';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email is in use', (done) => {
        var email = users[0].email;
        var password = users[0].password;

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((error) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => done(error));
            });
    });
});