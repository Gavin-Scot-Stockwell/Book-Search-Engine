import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in environment variables');
}
console.log('JWT_SECRET_KEY loaded:', "--> " + secretKey + " <--" + " is the name of the secret key");

// Function to authenticate the token
export const authenticateToken = ({ req }: any) => {
    let token = req.body.token || req.query.token || req.headers.authorization;

    console.log(token + " <------ token PREPARE TO BE EXTRACTED");


    console.log('Received token from body:', req.body.token); // Log the token received from the body
    console.log('Received token from query:', req.query.token); // Log the token received from the query
    console.log('Received token from headers:', req.headers.authorization); // Log the token received from the headers

    // Extract token if in Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = token.split(' ').pop().trim();
        console.log('Extracted token from Authorization header:', token); // Log the extracted token from Authorization header
    }

    if (!token) {
        console.log('No token provided');
        return req;
    }

    try {
        const { data }: any = jwt.verify(token, secretKey || '', { maxAge: '20h' });
        req.user = data;
        console.log('Token verified, user data:', data);
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.log('Token expired');
        } else if (err.name === 'JsonWebTokenError') {
            console.log('Invalid token signature');
            console.log("key is ", secretKey + '<------');
            console.log("user data should be ", req.user + ' <------');
        } else {
            console.log('JWT verification error:', err.message);
        }
    }

    return req;
};

// Function to sign a token
export const signToken = (username: string, email: string, _id: unknown) => {
    const payload = { username, email, _id };
    console.log('Token payload:', payload); // Log the payload used to generate the token
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '20h' });
};



// Custom error class for authentication errors
export class AuthenticationError extends GraphQLError {
    constructor(message: string) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
};