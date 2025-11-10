// hash.js
const bcrypt = require('bcrypt');

const password = '!Escri8ma!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});