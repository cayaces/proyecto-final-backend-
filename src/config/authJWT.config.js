import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const jwtSecret = process.env.JWT_SECRET

export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token no válido' });
        req.user = user
        next()
    })
}

export const generatePasswordResetToken = (user) => {
    return jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}