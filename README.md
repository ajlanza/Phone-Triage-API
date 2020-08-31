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

POST: 
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

POST: 
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

POST: 
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

### /api/users
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