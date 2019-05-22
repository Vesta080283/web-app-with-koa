const bcrypt = require('bcryptjs');

/*
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return Promise.join(knex('users').insert([
        {username: 'Sam Heughan', email: 'samheughan@gmail.com', password: 'sam123456'},
        {username: 'Caitriona Balfe', email: 'caitrionabalfe@gmail.com', password: 'cait123456'},
        {username: 'Sophie Skelton', email: 'sophieskelton@gmail.com', password: 'sophi123456'},
        {username: 'Richard Rankin', email: 'richardrankin@gmail.com', password: 'rich123456'}
      ])
      );
  });
};
*/

exports.seed = (knex, Promise) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('jer123456', salt);
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'Jeremy Mackenzy',
        password: hash,
      })
    );
  });
};