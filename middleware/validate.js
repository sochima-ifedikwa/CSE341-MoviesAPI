const { body, validationResult } = require('express-validator');

const actorRules = () => {
    return [
        body('name').notEmpty().isString().withMessage('Name must be a string'),
        body('birthYear').isISO8601().toDate().withMessage('Birthdate must be a valid date'),
        body('nationality').notEmpty().isString().withMessage('Nationality must be a string'),
        body('knownFor').notEmpty().isArray().withMessage('Known for must be an array of strings'),
        body('knownFor.*').notEmpty().isString().withMessage('Each known for must be a string'),
        body('awards').notEmpty().isArray().withMessage('Awards must be an array of strings'),
        body('awards.*').notEmpty().isString().withMessage('Each award must be a string'),
    ];
};

const directorRules = () => {
    return [
        body('name').notEmpty().isString().withMessage('Name must be a string'),
        body('birthYear').isISO8601().toDate().withMessage('Birthdate must be a valid date'),
        body('nationality').notEmpty().isString().withMessage('Nationality must be a string'),
        body('notableWorks').notEmpty().isArray().withMessage('Notable works must be an array of strings'),
        body('notableWorks.*').notEmpty().isString().withMessage('Notable works must be a string'),
        body('awards').notEmpty().isArray().withMessage('Awards must be an array of strings'),
        body('awards.*').notEmpty().isString().withMessage('Each award must be a string'),
    ];
};

const movieRules = () => {
    return [
        body('title').notEmpty().isString().withMessage('Title must be a string'),
        body('releaseYear').isInt({ min: 1888 }).withMessage('Release year must be a valid year'),
        body('director').notEmpty().isString().withMessage('Director must be a string'),
        body('actors').isArray().withMessage('Actors must be an array of strings'),
        body('actors.*').isString().withMessage('Each actor must be a string'),
        body('producer').notEmpty().isString().withMessage('Producer must be a string'),
        body('country').notEmpty().isString().withMessage('Country must be a string'),
        body('genres').isArray().withMessage('Genres must be an array of strings'),
        body('genres.*').isString().withMessage('Each genre must be a string'),
        body('category').notEmpty().isString().withMessage('Category must be a string'),
    ];
}

const genreRules = () => {
    return [
        body('name').notEmpty().isString().withMessage('Genre name must be a string'),
        body('description').notEmpty().isString().withMessage('Description must be a string'),
    ];
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    actorRules,
    directorRules,
    movieRules,
    genreRules,
    validate 
};