import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
//import { Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
//import { Book } from '../models/Book';

//import { getMe, deleteBook } from '../utils/API';
//import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';




const SavedBooks = () => {
  const { data } = useQuery(QUERY_ME);
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  if (data?.me && data.me !== userData) {
    setUserData(data.me);
  }


  // Instead, use the useQuery() hook to execute the GET_ME 
  // query on load and save it to a variable named userData.





  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: QUERY_ME }],
    onError: (err) => {
      console.error(err);
    },
  });
  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
      });
      removeBookId(bookId);
      setUserData({
        ...userData,
        savedBooks: userData.savedBooks.filter((book) => book.bookId !== bookId),
      });
    } catch (err) {
      console.error(err);
    }
  };

 // removeBookId(bookId);

  // if data isn't here yet, say so


  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
