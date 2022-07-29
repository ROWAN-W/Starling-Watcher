# Attention

This branch is very different from the current (07/28) develop branch. It is developed along with database branch to implement JWT. Only test this branch's front-end with database branch. 

## What's new [Deployment]

1. JWT - using axios and axios interceptor to bring token and refresh automatically. Except for design/images

2. Stay Login until the refresh token expires - user doesn't need to re-login when refreshing the page.

3. Storing user's projects until the refresh token expires - user doesn't lose his/her changes when refreshing the page.

4. More error handling to cope with inconsistent data from the database.

## side note

1. use http://localhost:8080/design/database to see the entire user db, use http://localhost:8080/design/initialize to initialize the database

2. The CSS colour might be slightly different from develop branch since I modify CSS in develop branch directly
