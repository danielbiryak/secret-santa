const knex = require('knex')
const config = require('../knexfile')
const db = knex(config.development)

module.exports = {
    addToWishes,
    addToShuffle,
    findWishesByIds,
    findPairsByIds,
    findPairById
}

async function addToWishes(name, lastname, wishes){
    let [id] = await db('wishes').insert({name: name, lastname: lastname, wish: wishes})
    return id
}

async function addToShuffle(shuffled_list){
    await db('result_shuffle').insert(shuffled_list)
}

function findWishesByIds(ids = []){
    return db('wishes').whereIn('wish_id',ids)
}

function findPairsByIds(ids = []){
    return db('result_shuffle').whereIn('retriever', ids)
}

function findPairById(id){
    return db('result_shuffle').where('sender', id)
}