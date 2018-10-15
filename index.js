const newrelic = require('newrelic');
newrelic.agent.on('transactionFinished', (tx) => console.log(tx.getFullName()));
require('@newrelic/apollo-server-express');

const express = require('express');

const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String,
    books: [Book]
  }
  
  type Book {
    title: String
    author: Author
  }

  type Author {
    first_name: String
    last_name: String
  }

`;

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: {
      first_name: 'JK',
      last_name: 'Rowling',
    },
  },
  {
    title: 'Jurassic Park',
    author: {
      first_name: 'Michael',
      last_name: 'Crichton',
    },
  },
];


// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    books: () => books
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.use(function(req, res, next) { 

  console.log(" server.schema._typeMap.Query = ");
  console.dir(server.schema._typeMap.Query);

  console.log(req.originalUrl);
  console.log(req.method);
  next();
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
