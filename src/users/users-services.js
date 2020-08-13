const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password can\'t start or end with empty spaces'
    }
  },
  hasUserWithUsername(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser){
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return { 
      id: user.id,
      username: xss(user.username),
      first_name: xss(user.first_name),
      last_name: xss(user.last_name)
    }
  },

}

module.exports = UsersService;