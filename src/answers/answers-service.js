const AnswersService = {
  updateWorkedCount(knex, id, newWorkedCount) {
    return knex('solutions')
      .where({ id })
      .update( newWorkedCount)
  },
}

module.exports = AnswersService