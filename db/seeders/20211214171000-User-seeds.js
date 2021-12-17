'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'demo',
        hashedPassword: '$2a$10$P8SC6WjSWo7W4GZBeZY9jOM19lSTnp0w5D.smI9PJf6aIpmMElGxa',
        firstName: 'Demo',
        lastName: 'McDemo',
        email: 'demo@demo.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'barry',
        hashedPassword: '$2a$10$P8SC6WjSWo7W4GZBeZY9jOM19lSTnp0w5D.smI9PJf6aIpmMElGxa',
        firstName: 'Barry',
        lastName: 'Lasty',
        email: 'barry@lasty.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'sneaky',
        hashedPassword: '$2a$10$P8SC6WjSWo7W4GZBeZY9jOM19lSTnp0w5D.smI9PJf6aIpmMElGxa',
        firstName: 'Alaia',
        lastName: 'Butters',
        email: 'alaia@butters.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
