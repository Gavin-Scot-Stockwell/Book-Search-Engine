import { gql } from '@apollo/client';
// LOGIN_USER will execute the loginUser mutation set up using Apollo Server.
export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      _id
      bookCount
      email
      savedBooks {
        _id
        authors
        bookId
        description
        image
        link
        title
      }
    }
  }
}
        `;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        }
        }
        }
        `;

export const SAVE_BOOK = gql`
mutation SaveBook($input: BookInput!) {
  saveBook(input: $input) {
    _id
    bookCount
    email
    username
    savedBooks {
      _id
      bookId
      description
      image
      link
      title
      authors
    }
  }
}
        `;
export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
    bookCount
    email
    username
    savedBooks {
      _id
      authors
      bookId
      description
      image
      link
      title
    }
  }
}
        `;
