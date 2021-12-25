'use strict';
const today = new Date()
const yesterday = new Date(today)
const tomorrow = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
tomorrow.setDate(tomorrow.getDate() + 1)

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      {
        name: 'Get milk',
        description: null,
        deadline: new Date(),
        isCompleted: false,
        categoryId: 4,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Get dog food',
        description: null,
        deadline: new Date(),
        isCompleted: false,
        categoryId: 2,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Get laundry detergent',
        description: null,
        deadline: new Date(),
        isCompleted: false,
        categoryId: 1,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Get eggs',
        description: null,
        deadline: new Date(),
        isCompleted: false,
        categoryId: 2,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Get bread',
        description: null,
        deadline: new Date(),
        isCompleted: false,
        categoryId: 4,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Get bananas',
        description: null,
        deadline: new Date(),
        isCompleted: false,
        categoryId: 4,
        listId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Plan meeting with Ali',
        description: '',
        deadline: tomorrow,
        isCompleted: false,
        categoryId: 3,
        listId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bring in new plant',
        description: '',
        deadline: null,
        isCompleted: false,
        categoryId: 4,
        listId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Replace Ben\'s stapler',
        description: '',
        deadline: today,
        isCompleted: false,
        categoryId: 3,
        listId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Plan work party',
        description: '',
        deadline: tomorrow,
        isCompleted: false,
        categoryId: 2,
        listId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Start Garden',
        description: '',
        deadline: yesterday,
        isCompleted: true,
        categoryId: 1,
        listId: 3,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Organize computer files',
        description: '',
        deadline: null,
        isCompleted: false,
        categoryId: 4,
        listId: 3,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wash car',
        description: '',
        deadline: yesterday,
        isCompleted: false,
        categoryId: 2,
        listId: 3,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Switch insurance',
        description: '',
        deadline: tomorrow,
        isCompleted: false,
        categoryId: 2,
        listId: 3,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jen\'s bday party!',
        description: 'don\'t forget gift',
        deadline: tomorrow,
        isCompleted: false,
        categoryId: 2,
        listId: 4,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Plan Vacation',
        description: 'Off for 2 weeks!',
        deadline: null,
        isCompleted: false,
        categoryId: 4,
        listId: 4,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Buy snowboard',
        description: null,
        deadline: null,
        isCompleted: false,
        categoryId: 4,
        listId: 4,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Plan knitting tournament',
        description: 'from stitches to riches',
        deadline: null,
        isCompleted: false,
        categoryId: 2,
        listId: 4,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Tasks', null, {});
  }
};
