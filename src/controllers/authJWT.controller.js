export const protectedRouteHandler = (req, res) => {
    res.json({ message: 'Esta ruta es protegida', user: req.user });
};