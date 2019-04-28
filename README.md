# Bookstore REST API using NodeJS & Mongo DB
A REST API built on NodeJS/MongoDB

Book store API documentation
_http://[site]:[port]/api/endpoints_

## Endpoints /api: 
### /user
* *user/signup* [POST]
   - Sign up as a new user
   - Required json body params - ‘email’, ‘password’
* *user/login* [POST]
   - Login with existing creds
   - Required json body params - ‘email’, ‘password’

### /store
* */store* [GET] 
  - Get list of books available in store
* */store/title* [GET] 
  - Get book filtered by title
* */store* [POST]
  - Add new books to the store
  - Required json body params - ‘title’, ‘desc’, ‘price’

### /orders
* */orders* [GET]
  - Get list of orders placed by the logged in user
* */orders/orderID* [GET]
  - Get a particular order
* */orders/title* [POST]
  - Place order of a book based on the title provided
  - Required json body params - ‘id’ and title’

### NOTE: 
* POST requires authorization bearer token to be provided in headers.
* Accepted conventions - url-encoded and json

### Glossary: 
* *context*: gives context about the called api endpoint
* *message*: user message
* *error*: message for debugging, both for user/developer
* *result*: contains desired payload/data

### Improvements not done:
* Store
  -  Limit querying to a fixed number rather than fetching all data in a single call
  -  Adding pagination to query to move to next set of result

* Orders
  -  Filter order by order-number, title, date
