// if (process.env.NODE_ENV === 'test') next(); // skip auth
/**
 * Middleware function to check if a user is authenticated.
 * 
 * - It verifies that there is an active user session.
 * - If no user is found in the session (req.session.user is undefined),
 *   the request is blocked with a 401 Unauthorized response.
 * - If the user is authenticated, the request continues to the next middleware or route handler.
 */
const isAuthenticated = (req, res, next) => {
    // Check if a user session exists
    if (req.session.user === undefined) {
        // If not authenticated, respond with a 401 Unauthorized status
        return res.status(401).json('You do not have any authorization to access this resource');
    }

    // If authenticated, allow the request to proceed
    next();
};

// Export the middleware function for use in route protection
module.exports = { 
    isAuthenticated 
};
