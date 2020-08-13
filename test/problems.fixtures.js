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
      title: 'My battery is hot.', problem_type: 3
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

module.exports = {
  makeProblemsArray,
}