'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'personal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'work',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'fun',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'urgent',
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ])
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
