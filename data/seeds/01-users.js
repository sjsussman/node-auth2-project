exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const user = [
    {
      username: 'test',
      password: 'test123'
    },

  ];

  return knex("users")
    .insert(user)
    .then(() => console.log("\n== Seed data for roles table added. ==\n"));
};
