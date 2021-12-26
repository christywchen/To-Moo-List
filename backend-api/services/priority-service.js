const db = require('../../db/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get
async function getPriorities() {
    return await db.Priority.findAll();
}

async function getTasksByPriorityAndUser(priorityId, userId) {
    return await db.Task.findAll({
        where: {
            priorityId,
            userId
        },
        include: [db.List, db.Priority]
    });
}

// Post
async function createPriority(name) {
    return await db.Priority.create({
        name
    });
}

module.exports = {
    getPriorities,
    getTasksByPriorityAndUser,
    createPriority
}
