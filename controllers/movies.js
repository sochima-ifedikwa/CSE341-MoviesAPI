// Import MongoDB connection and ObjectId for ID handling
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

/* *************************************
*  Get all movies
* ************************************* */
const getAll = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        const result = await mongodb.getDatabase().db('movies').collection('movies').find();
        const movies = await result.toArray();

        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found!' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error || 'Some error occurred while retrieving the movies.' });
    }
};

/* *************************************
*  Get a movie by its ID
* ************************************* */
const getById = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        const movieId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('movies').find({ _id: movieId });
        const movies = await result.toArray();

        if (!movies || movies.length === 0) {
            return res.status(404).json({
                message: `Movie with ID ${req.params.id} not found`
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(movies[0]);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Some error occurred while retrieving the movie.' });
    }
};

/* *************************************
*  Get movies by any field (filter)
*  Example: /movies?country=USA&category=Action
* ************************************* */
const getByField = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        const result = await mongodb.getDatabase().db('movies').collection('movies').find(req.query);
        const movies = await result.toArray();

        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found in that field!' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Some error occurred while retrieving movies.' });
    }
};

/* *************************************
*  Create a new movie
* ************************************* */
const createMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        const newMovie = {
            title: req.body.title,
            releaseYear: req.body.releaseYear, // Example: 2024
            director: req.body.director,
            actors: req.body.actors, // Expected to be an array
            producer: req.body.producer,
            country: req.body.country,
            genres: req.body.genres, // Expected to be an array
            category: req.body.category
        };

        const result = await mongodb.getDatabase().db('movies').collection('movies').insertOne(newMovie);

        if (result.acknowledged) {
            res.status(201).json({
                message: 'Movie created successfully',
                movieId: result.insertedId
            });
        } else {
            res.status(500).json({
                message: 'Failed to create Movie'
            });
        }
    } catch (error) {
        console.error('Error creating Movie:', error);
        res.status(500).json({ message: error || 'Some error occurred while creating the movie.' });
    }
};

/* *************************************
*  Update an existing movie by ID
* ************************************* */
const updateMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Movie ID format'
            });
        }

        const movieId = new ObjectId(req.params.id);
        const updatedMovie = {
            title: req.body.title,
            releaseYear: req.body.releaseYear,
            director: req.body.director,
            actors: req.body.actors,
            producer: req.body.producer,
            country: req.body.country,
            genres: req.body.genres,
            category: req.body.category
        };

        const result = await mongodb.getDatabase().db('movies').collection('movies').updateOne(
            { _id: movieId },
            { $set: updatedMovie }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Movie with ID ${req.params.id} not found`
            });
        }

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Movie updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the movie'
            });
        }
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: error || 'Some error occurred while updating the movie.' });
    }
};

/* *************************************
*  Delete a movie by ID
* ************************************* */
const removeMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Movie ID format'
            });
        }

        const movieId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('movies').deleteOne({ _id: movieId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Movie with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the movie.' });
    }
};

/* *************************************
*  Module Exports
* ************************************* */
module.exports = { 
    getAll,
    getById,
    getByField,
    createMovie,
    updateMovie,
    removeMovie
};
