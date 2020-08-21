const bcrypt = require('bcryptjs')

function makeProblemTypesArray() {
    return [
      {
        id: 1,
        name: 'Screen', 
        type:'screen'
      },
      {
        id: 2,
        name: 'Audio', 
        type: 'audio'
      },
      {
        id: 3,
        name: 'Battery', 
        type: 'battery'
      },
      {
        id: 4,
        name: 'Software', 
        type: 'software'
      }
    ]
  }
  
function makeProblemsArray() {
    return[
      {
        id: 1, 
        title: 'My screen is cracked.', 
        problem_type: 1
      },
      {
        id: 2,
        title: 'My screen has burnt pixels.', 
        problem_type: 1
      },
      {
        id: 3,
        title: 'My screen is always amber tinted.', 
        problem_type: 1
      },
      {
        id: 4,
        title: 'My screen won\'t unlock.', 
        problem_type: 1
      },
      {
        id: 5,
        title: 'My screen isn\'t taking up the full space.', 
        problem_type: 1
      },
      {
        id: 6,
        title: 'My screen has lines in it.', 
        problem_type: 1
      },
      {
        id: 7,
        title: 'My phone is too loud.', 
        problem_type: 2
      },
      {
        id: 8,
        title: 'My phone isn\'t loud enough.', 
        problem_type: 2
      },
      {
        id: 9,
        title: 'My battery is hot.', 
        problem_type: 3
      },
      {
        id: 10,
        title: 'My battery doesn\t long long enough.', 
        problem_type: 3
      },
      {
        id: 11,
        title: 'My phone is showing weird error messages.', 
        problem_type: 4
      }
    ]
  }

function makeSolutionsArray() {
  return [
    {
      id: 1,
      problem_id: 1,
      problem_type: 1,
      title: 'Easy fix for cracked screen.', 
      content: 'Buy a new phone.', 
      worked_count: 1
    },
    {
      id: 2,
      problem_id: 1,
      problem_type: 1,
      title: 'Another cracked screen solution.', 
      content: 'If under warrenty, bring your phone back to your service provider.', 
      worked_count: 5
    },
    {
      id: 3,
      problem_id: 2,
      problem_type: 1,
      title: 'Works for nihilists.', 
      content: 'Stop caring.', 
      worked_count: 1
    },
    {
      id: 4,
      problem_id: 2,
      problem_type: 1,
      title: 'Don\'t try this at home.', 
      content: 'Use burn cream.', 
      worked_count: 0
    },
    {
      id: 5,
      problem_id: 3,
      problem_type: 3,
      title: 'Not advisable', 
      content: 'Recharge with lightning Dr.Frankenstein.',
      worked_count: 0  
    },
    {
      id: 6,
      problem_id: 11,
      problem_type: 4,
      title: 'Recycled solution.', 
      content: 'Use tin cans and a string.', 
      worked_count: 0
    },
    {
      id: 7,
      problem_id: 11,
      problem_type: 4,
      title: 'Reboot.', 
      content: 'Reboot your phone.', 
      worked_count: 20
    },
    {
      id: 8,
      problem_id: 8,
      problem_type: 2,
      title: 'I know it\'s obvioius.', 
      content: 'Make sure you don\'t have bluetooth headphone connected.', 
      worked_count: 5
    },
    {
      id: 9,
      problem_id: 7,
      problem_type: 2,
      title: 'Hmmm.', 
      content: 'Check if your phone is on speaker.', 
      worked_count: 1
    }
   ]
}

function makeUsersArray() {
  return [
    {
      username: 'User', 
      first_name: 'Firstname', 
      last_name:'Lastname', 
      password: 'password'},
    {
      username: 'OneEye', 
      first_name: 'Mads', 
      last_name:'Mikkelsen', 
      password: 'password'},
    {
      username: 'Dimmy', 
      first_name: 'Dim', 
      last_name:'Sum', 
      password: 'password'},
  ]
}

function makePhoneTriageFixtures() {
    const testUsers = makeUsersArray()
    const testProblems = makeProblemsArray()
    const testSolutions = makeSolutionsArray()
    return { testUsers, testProblems, testSolutions }
}

function makeExpectedProblem(problem) {
  return {
    id: problem.id,
    title: problem.title,
    problem_type: problem.problem_type,
  }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        solutions,
        problems,      
        users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE problems_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE solutions_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`) ,
        trx.raw(`SELECT setval('problems_id_seq', 0)`),
        trx.raw(`SELECT setval('solutions_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`), 
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() => {
      const place = users.length -1;
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[place].id]
      )}
    )
}

function seedPhoneTriageTables(db, users, problems, solutions) {
  return db.transaction(async trx => {
    const problemsPlace = problems.length -1;
    const solutionsPlace = solutions.length -1;
    await seedUsers(trx, users)
    await trx.into('problems').insert(problems)
    await trx.raw(
      `SELECT setval('problems_id_seq', ?)`,
      [problems[problemsPlace].id],
    )
    if (solutions.length) {
      await trx.into('solutions').insert(solutions)
      await trx.raw(
        `SELECT setval('solutions_id_seq', ?)`,
        [solutions[solutionsPlace].id],
      )
    }
  })
}
  
  module.exports = {
    makeProblemsArray,
    makeProblemTypesArray,
    makeSolutionsArray,
    makeUsersArray,
    makePhoneTriageFixtures,
    makeExpectedProblem,

    cleanTables,
    seedUsers,
    seedPhoneTriageTables,
  }