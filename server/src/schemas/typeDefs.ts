import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Book {
    _id: ID
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    savedBooks: [Book]
    bookCount: Int
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  input BookInput {
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

export default typeDefs;