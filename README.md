# Phone Triage API

API designed to process problem types, specific problems, solutions, and users of Phone Triage site.

## API Endpoints:


### /api/types
GET: returns all problem types
* Success 
  * Code: 200
  * Content:  
        [  
                { **id**: integer, **name**: "string", **type**: "string" },  
                { **id**: integer, **name**: "string", **type**: "string" }  
        ]

### /api/types/:id
GET: 
* Success 
  * Code: 200
  * Content:  
  { **id**: integer, **title**: "string", **type**: "string" }
* Error
  * Code: 40X
  * Content:  
  { error: { message: "Error message string." } }
   
### /api/problems
GET: returns all problems
* Success 
  * Code: 200
  * Content:  
  [  
  { **id**: integer, **title**: "string", **problem_type**: integer },  
  { **id**: integer, **title**: "string", **problem_type**: integer }  
  ]
### /api/problems:id
GET: returns specific problem
* Success 
  * Code: 200
  * Content:  
  { **id**: 1, **title**: "string", **problem_type**: integer }
* Error
  * Code: 40X
  * Content:  
  { error: { message: "Error message string." } }
