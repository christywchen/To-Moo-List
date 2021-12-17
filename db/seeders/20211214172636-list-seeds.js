'use strict';
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Lists', [
      {
        name: 'Groceries',
        userId: 1,
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        name: 'Work',
        userId: 1,
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        name: 'Misc.',
        userId: 1,
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        name: 'Fun Stuff',
        userId: 1,
        createdAt: yesterday,
        updatedAt: yesterday
      },

    ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Lists', null, {});
  }
};
