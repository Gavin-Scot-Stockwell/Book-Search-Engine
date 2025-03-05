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
export const authenticateToken = ({ req }: { req: any }) => {
    let token = req.body.token || req.query.token || req.headers.authorization;

    console.log('Received token from body:', req.body.token);
    console.log('Received token from query:', req.query.token);
    console.log('Received token from headers:', req.headers.authorization);

    // Extract token if in Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Extracted token from Authorization header:', token);
    }

    // Check for token in HTTP-only cookies (more secure)
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
        console.log('Extracted token from HTTP-only cookie');
    }

    if (!token) {
        console.log('No token provided');
        return req;
    }

    try {
        const { data }: any = jwt.verify(token, secretKey, { maxAge: '2h' });
        req.user = data;
        console.log('Token verified, user data:', data);
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.log('Token expired');
        } else if (err.name === 'JsonWebTokenError') {
            console.log('Invalid token signature');
        } else {
            console.log('JWT verification error:', err.message);
        }
    }

    return req;
};

// Function to sign a token
export const signToken = (username: string, email: string, _id: unknown) => {
    const payload = { username, email, _id };

    //console.log('Generated token:', token); // Log the generated token
    console.log('Token payload:', payload); // Log the payload used to generate the token
    return jwt.sign({ data: payload }, secretKey, { expiresIn: '20h' });

};

// Function to set the token as an HTTP-only cookie
export const setAuthCookie = (res: any, token: string) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
    console.log('Auth token set in HTTP-only cookie');
};

// Custom error class for authentication errors
export class AuthenticationError extends GraphQLError {
    constructor(message: string) {
        super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
};