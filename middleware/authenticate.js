const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json('You do not have any authorization to access this resource');
    }
    next();
};

module.exports = { 
    isAuthenticated 
}