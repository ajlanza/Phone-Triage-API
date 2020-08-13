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

module.exports = {
  makeProblemTypesArray
}