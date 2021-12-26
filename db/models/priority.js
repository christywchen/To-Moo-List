'use strict';
module.exports = (sequelize, DataTypes) => {
  const Priority = sequelize.define('Priority', {
    name: DataTypes.STRING
  }, {});
  Priority.associate = function(models) {
    Priority.hasMany(models.Task, { foreignKey: 'priorityId' });
  };
  return Priority;
};
