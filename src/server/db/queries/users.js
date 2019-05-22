const knex = require('../connection');
function getAllUsers() {
    return knex('users')
    .select('*');
  }

  function getSingleUser(id) {
    return knex('user')
    .select('*')
    .where({ id: parseInt(id) });
  }

  function addUser(user) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);
    return knex('users')
    .insert({
      username: user.username,
      password: hash,
      email: user.email
    })
    .returning('*');
  }
  
  function updateUser(id, user) {
    return knex('users')
    .update(user)
    .where({ id: parseInt(id) })
    .returning('*');
  }

  function deleteUser(id) {
    return knex('users')
    .del()
    .where({ id: parseInt(id) })
    .returning('*');
  }

  module.exports = {
    getAllUsers,
    getSingleUser,
    addUser,
    updateUser,
    deleteUser
  };