import User from '../models/User.js';
import Book from '../models/Book.js';

import { UserDocument } from '../models/User.js';
import { BookDocument } from '../models/Book.js';

import { signToken } from '../utils/auth.js';
import { AuthenticationError } from 'apollo-server-express';

interface AddUserArgs extends UserDocument {
    username: string;
    email: string;
    password: string;
}

interface LoginUserArgs extends UserDocument {
    email: string;
    password: string;
}


interface SaveBookArgs {
    input: BookDocument
}

interface RemoveBookArgs extends UserDocument {
    bookId: string;
}

const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                const user = await User.findOne({ _id: context.user._id }).populate('savedBooks');
                return user;
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, { username, email, password }: AddUserArgs) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, email, user._id);//SIGN TOKEN IS NOT WORKING
            console.log(token, " this is a the ser.username, email, user._id = signToken")
            console.log(user, " this is the user with the token for that return")
            return { token, user };
        },

        saveBook: async (_parent: any, { input }: SaveBookArgs, context: any) => {
            if (context.user) {
                console.log(input);

                try {
                    const book = await Book.create({ ...input });

                    const updatedUser = await User.findOneAndUpdate(

                        { _id: context.user._id },

                        { $push: { savedBooks: book } },


                        { new: true }
                    ).populate('savedBooks');

                    console.log(updatedUser + " new saved book");
                    return updatedUser;
                } catch (err) {
                    console.log(err + " this is where there are no more books to save");

                }
                throw new AuthenticationError('You need to be logged in!');
            }
        }
    }
};
// },

//    //     removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
//             if (context.user) {
//                 const book = await Book.findOneAndDelete({
//                     _id: bookId,
//                 });

//                 if (!book) {
//                     throw new AuthenticationError('Book not found');
//                 }

//                 const updatedUser = await User.findOneAndUpdate(
//                     { _id: context.user._id },
//                     { $pull: { savedBooks: { book } } },
//                     { new: true }
//                 ).populate('savedBooks');

//                 return updatedUser;
//             }
//             throw new AuthenticationError('You need to be logged in!');
//         },
// },
// };

export default resolvers;