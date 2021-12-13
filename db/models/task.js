'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    isCompleted: DataTypes.BOOLEAN,
    categoryId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.User, { foreignKey: 'userId' });
    Task.belongsTo(models.List, { foreignKey: 'listId' });
    Task.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };
  return Task;
};
