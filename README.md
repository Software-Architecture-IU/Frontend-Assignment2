### Frontend Structure

The frontend itself is an essentially concise typescript application. The source code is placed in the `src/main.ts` file. Talking about the modularity, it is overkill for this business logic (send | retrieve messages from anonymous chat). The single file gives developers the opportunity to instantly see all the source code and not search it through the thousands and thousands of relatively small files.

### Additional Tools

For the code quality, we use the eslint, which is to adjust the code for the single list of criteria and format the code as in the predefined configuration. Additionally, we use prettier to have the developer's eye code style.

### How to run the frontend?

1. Install Node.js, npm.
2. Install dependencies: `npm install`
3. Run the server: `npm start`
