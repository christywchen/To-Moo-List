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
    // associations can be defined here
  };
  return Task;
};