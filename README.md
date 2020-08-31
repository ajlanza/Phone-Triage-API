# Phone Triage API

API built with Node and Express to utilize a PostgresQL database.
Testing accomplished with Mocha and Chai.  
The api is designed to process types of problems, specific problems, solutions to problems, and users of the Phone Triage site.

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

POST: add a problem to the database

Required in body:
 { 
 **problem_type**: integer,
 **title**: "string",
 }
 
* Success
  * Code: 201
  * Content:
  { **id**: integer, **title**: "string", **problem_type**: integer }
* Error
  * Code: 40X
  * Content: 
    { error: { message: "Error message string." } }

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

### /api/solutions
GET: returns all solutions
* Success
  * Code: 200
  * Content: 
  [  
    {
    **id**: integer,
    **problem_id**: integer,
    **problem_type**: integer,
    **title**: "string",
    **content**: "string",
    **worked_count**: integer
    },
    **id**: integer,
    **problem_id**: integer,
    **problem_type**: integer,
    **title**: "string",
    **content**: "string",
    **worked_count**: integer
    }
    ]

POST: add a solution to the database

Required in body:
 { 
 **problem_id**: integer,
 **problem_type**: integer,
 **title**: "string",
 **content**: "string"
 }
 
* Success
  * Code: 201
  * Content:  
  {
    **id**: integer,
    **problem_id**: 1,
    **problem_type**: integer,
    **title**: "string",
    **content**: "string",
    **worked_count**: integer
  }
* Error
  * Code: 40X
  * Content: 
    { error: "Error message string." }

### /api/solutions:id
GET: returns specific solution
* Success 
  * Code: 200
  * Content:  
  {
    **id**: integer,
    **problem_id**: 1,
    **problem_type**: integer,
    **title**: "string",
    **content**: "string",
    **worked_count**: integer
  }
* Error
  * Code: 40X
  * Content:  
  { error: { message: "Error message string." } }

### /api/users

POST: create a new user

Required in body:
 { 
 **username**: "string",
 **password**: "string",
 **first_name**: "string",
 **last_name**: "string"
 }
 
* Success 
  * Code: 201
  * Content:  
  {
    **id**: integer,
    **username**: "string",
    **first_name**: "string",
    **last_name**: "string"
  }
* Error
  * Code: 40X
  * Content:  
  { error: { message: "Error message string." } }
  
 ### /api/auth/login
 POST: get an auth token
 
 Required in body:
 { 
 **username**: "string",
 **password**: "string"
 }
 
 * Success 
  * Code: 200
  * Content:  
  {
    **authToken**: "string"
  }
* Error
  * Code: 40X
  * Content:  
  { error: { message: "Error message string." } }
