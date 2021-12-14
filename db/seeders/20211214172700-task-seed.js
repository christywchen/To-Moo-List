'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      {
        name: 'get milk',
        description: 'at safeway',
        deadline: new Date(),
        isCompleted: false,
        categoryId: 1,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'talk to boss',
        description: 'at work',
        deadline: new Date(),
        isCompleted: false,
        categoryId: 2,
        listId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
