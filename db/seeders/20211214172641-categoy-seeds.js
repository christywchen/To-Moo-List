'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
      {
        name: 'Low',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'High',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
