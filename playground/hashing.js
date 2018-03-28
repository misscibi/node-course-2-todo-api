const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

// takes the object and signs it, returns the token
var token = jwt.sign(data, '123abs');
console.log(token);

// takes the token and makes sure the data was not manipulated
var decoded = jwt.verify(token, '123abs');
console.log(decoded);

// var message = 'I am Ganondorf.';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//     console.log('Data was not changed.');
// } else {
//     console.log('Data was changed. Do not trust!')
// }