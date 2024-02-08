import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

export const generateToken = (user) => {
    return jwt.sign({ user }, jwtSecret, { expiresIn: '1h' }); 
};
