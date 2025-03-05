import { Schema, model, type Document } from 'mongoose';

export interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

const bookSchema = new Schema<BookDocument>({
  bookId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});

const Book = model<BookDocument>('Book', bookSchema);

export default Book;