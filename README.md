# Backend Boilerplate

Fast and scalable backend for Nodejs and Graphql projects. 
Supports SQL and NoSQL databases, in this case using PostgreSQL.

Features:
- Register 
- Testing (Jest)
- Confirmation email
- Login
- Forgot Password
- Logout
- Cookies and Http Header
- Authentication middleware
- Rate limiting
- Locking accounts

        
Steps to run this project:

1. Run `yarn install` command
2. Setup database settings inside `ormconfig.json` file
3. Run `yarn test` command on UNIX or `yarn win-test` command on Windows.

If you want a client for this backend you can check [rubackgen](https://github.com/rubenbase/rubackgen), a client that uses react, typescript and yarn workspaces and is integrated with this backend! 

