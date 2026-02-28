export const addDemoHeaders = (req, res, next) => {
    res.setHeader("X-Demo-Page", "true");
    res.setHeader("X-Middleware-Demo", "This route uses route-specific middleware");
    next();
};