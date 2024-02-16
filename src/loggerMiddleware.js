import logger from "./logger.js"
const loggerMiddleware = (req, res, next) => {
    req.logger = logger
    next();
}
export default loggerMiddleware