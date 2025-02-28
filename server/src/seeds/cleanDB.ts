import User from '../models/User';
import Book from '../models/Book';

const cleanDB = async (): Promise<void> => {
    try {

        await User.deleteMany({});
        console.log('User collection cleaned.');

        await Book.deleteMany({});
        console.log('Book collection cleaned.');

    } catch (err) {
        console.error('Error cleaning collections:', err);
        process.exit(1);
    }
};

export default cleanDB;
