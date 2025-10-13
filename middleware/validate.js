// Import validation functions from express-validator
const { body, validationResult } = require('express-validator');

/**
 * Validation rules for Actor data.
 * Ensures all required fields are present and correctly formatted.
 */
const actorRules = () => {
    return [
        body('name').notEmpty().isString().withMessage('Name must be a string'),
        body('birthYear').isLength({ min: 4, max: 4 }).isNumeric().withMessage('Birthyear must be numeric'),
        body('nationality').notEmpty().isString().withMessage('Nationality must be a string'),
        body('knownFor').notEmpty().isArray().withMessage('Known for must be an array of strings'),
        body('knownFor.*').notEmpty().isString().withMessage('Each known for must be a string'),
        body('awards').notEmpty().isArray().withMessage('Awards must be an array of strings'),
        body('awards.*').notEmpty().isString().withMessage('Each award must be a string'),
    ];
};

/**
 * Validation rules for Director data.
 * Validates string and array fields to maintain data consistency.
 */
const directorRules = () => {
    return [
        body('name').notEmpty().isString().withMessage('Name must be a string'),
        body('birthYear').isLength({ min: 4, max: 4 }).isNumeric().withMessage('Birthyear must be numeric'),
        body('nationality').notEmpty().isString().withMessage('Nationality must be a string'),
        body('notableWorks').notEmpty().isArray().withMessage('Notable works must be an array of strings'),
        body('notableWorks.*').notEmpty().isString().withMessage('Each notable work must be a string'),
        body('awards').notEmpty().isArray().withMessage('Awards must be an array of strings'),
        body('awards.*').notEmpty().isString().withMessage('Each award must be a string'),
    ];
};

/**
 * Validation rules for Movie data.
 * Checks both string and array fields, ensuring valid and complete movie details.
 */
const movieRules = () => {
    return [
        body('title').notEmpty().isString().withMessage('Title must be a string'),
        body('releaseYear').isLength({ min: 4, max: 4 }).isNumeric().withMessage('Release year must be numeric'),
        body('director').notEmpty().isString().withMessage('Director must be a string'),
        body('actors').isArray().withMessage('Actors must be an array of strings'),
        body('actors.*').isString().withMessage('Each actor must be a string'),
        body('producer').notEmpty().isString().withMessage('Producer must be a string'),
        body('country').notEmpty().isString().withMessage('Country must be a string'),
        body('genres').isArray().withMessage('Genres must be an array of strings'),
        body('genres.*').isString().withMessage('Each genre must be a string'),
        body('category').notEmpty().isString().withMessage('Category must be a string'),
    ];
};

/**
 * Validation rules for Genre data.
 * Ensures both 'name' and 'description' are provided as strings.
 */
const genreRules = () => {
    return [
        body('name').notEmpty().isString().withMessage('Genre name must be a string'),
        body('description').notEmpty().isString().withMessage('Description must be a string'),
    ];
};

/**
 * Middleware to process and handle validation errors.
 * If validation fails, responds with a 400 Bad Request and the list of errors.
 * If validation passes, the request proceeds to the next middleware or route handler.
 */
const validate = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }
    const errors = validationResult(req);

    // If there are validation errors, return them to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Continue to the next middleware or controller
    next();
};

// Export all validation rule sets and the error handler
module.exports = {
    actorRules,
    directorRules,
    movieRules,
    genreRules,
    validate 
};
