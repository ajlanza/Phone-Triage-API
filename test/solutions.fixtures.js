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

module.exports = {
    makeSolutionsArray
}