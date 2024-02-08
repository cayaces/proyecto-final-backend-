import express from 'express';
import { authenticateToken } from "../config/authJWT.config.js"
import { protectedRouteHandler } from "../controllers/authJWT.controller.js"

const ProtectedRouter = express.Router();

ProtectedRouter.get('/', authenticateToken, protectedRouteHandler);

export default ProtectedRouter;
