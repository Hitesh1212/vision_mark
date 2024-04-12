const jwt = require('jsonwebtoken');

const tokenGenerate = id => {
  return jwt.sign({_id:id}, 'vision@mark2024', {
    expiresIn: '60d',
  });
};

module.exports = tokenGenerate;