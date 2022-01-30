exports.up = function (knex) {
    return knex.schema
        //First table
        .createTable('wishes', tbl => {
            tbl.increments('wish_id')
            tbl.string('lastname',30)
            tbl.string('name',30)
            tbl.text('wish')
            // tbl.timestamps(true, true)
        })//Second table
        .createTable('result_shuffle', tbl => {
            tbl.integer('sender').primary()
            tbl.integer('retriever').primary()
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('wishes')
        .dropTableIfExists('result_shuffle')
};
