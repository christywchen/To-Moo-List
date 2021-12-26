const db = require('../../db/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get
async function getListByPk(listId) {
    return await db.List.findByPk(listId);
}

async function getListsByUserId(userId) {
    return await db.List.findAll({
        where: { userId }
    });
}

async function getTasksByListId(listId) {
    return await db.Task.findAll({
        where: {
            listId: listId
        },
        include: [db.List, db.Priority]
    })
}

// Post
async function createList(name, userId) {
    return await db.List.create({
        name,
        userId
    });
}

// Put/Patch
async function updateList(list, name) {
    return await list.update({
        name
    });
}

// Destroy
async function deleteList(list) {
    return await list.destroy();
}

module.exports = {
    getListByPk,
    getListsByUserId,
    getTasksByListId,
    createList,
    updateList,
    deleteList
}
