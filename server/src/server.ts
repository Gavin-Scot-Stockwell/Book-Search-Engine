import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';

// Create a new ApolloServer instance with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo Server
const startApolloServer = async () => {
  // Start the Apollo Server
  await server.start();
  // Connect to the database
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  // Middleware to parse URL-encoded data
  app.use(express.urlencoded({ extended: false }));
  // Middleware to parse JSON data
  app.use(express.json());

  // Middleware to handle GraphQL requests
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      // Authenticate the token and attach the user to the context
      const user = authenticateToken({ req });
      return { user };
    },
  }));

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Start the Apollo Server
startApolloServer();