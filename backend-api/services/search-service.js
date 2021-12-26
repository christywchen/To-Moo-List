
const db = require('../../db/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get
async function getTasksByQuery(userId, word) {
    return await db.Task.findAll({
        where: {
            userId,
            name: {
                [Op.iLike]: '%' + word + '%'
            }
        },
        include: [db.List, db.Priority]
    });
}

module.exports = {
    getTasksByQuery
}
