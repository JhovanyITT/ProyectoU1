const bcrypt = require('bcryptjs')

let users = [
  {
    username: 'admin',
    password: bcrypt.hashSync('12345', 10) // Contraseña encriptada
  },
  {
    username: 'user',
    password: bcrypt.hashSync('password', 10) // Contraseña encriptada
  }
];

function getUserByUserName(username) {
  return users.find((user) => user.username === username);
}

function createUser(user) {
  const newUser = {
    username: user.username,
    password: bcrypt.hashSync(user.password, 10)
  }
  users.push(newUser);
  return newUser;
}

module.exports = {
  getUserByUserName,
  createUser
}