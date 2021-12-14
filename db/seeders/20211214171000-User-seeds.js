'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'jstnswn',
        hashedPassword: '$2a$10$P8SC6WjSWo7W4GZBeZY9jOM19lSTnp0w5D.smI9PJf6aIpmMElGxa',
        firstName: 'Justin',
        lastName: 'Sweeney',
        email: 'justin@justin.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'haozhen',
        hashedPassword: '$2a$10$P8SC6WjSWo7W4GZBeZY9jOM19lSTnp0w5D.smI9PJf6aIpmMElGxa',
        firstName: 'Haozhen',
        lastName: 'Shu',
        email: 'haozhen@haozhen.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'barry',
        hashedPassword: '$2a$10$P8SC6WjSWo7W4GZBeZY9jOM19lSTnp0w5D.smI9PJf6aIpmMElGxa',
        firstName: 'Barry',
        lastName: 'Barry',
        email: 'barry@barry.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
