const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

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
        res.status(500).json({message:error || 'Some error occurred while retrieving the movies.'});
    }

};      

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
        res.status(500).json({message:error.message || 'Some error occurred while retrieving the movie.'});
    }
};   

const getByField = async (req, res) => {//We can filter by any field with this same fuction
    //#swagger.tags = ['Movies']
    console.log(req.query);
    try {
        const result = await mongodb.getDatabase().db('movies').collection('movies').find(req.query);
        const movies = await result.toArray();

        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found in thay field!' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({message:error.message || 'Some error occurred while retrieving movies.'});
    }
}

//CRUD Operations

const createMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        const newMovie = {
            title: req.body.title,
            releaseYear: req.body.releaseYear, //YYYY
            director: req.body.director,
            actors: req.body.actors, //this is an array
            producer: req.body.producer,
            country: req.body.country,
            genres: req.body.genres, //this is an array
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
        res.status(500).json({ message:error || 'Some error occurred while creating the movie.' });
    }
     
};

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
        res.status(500).json({ message:error || 'Some error occurred while updating the movie.' });
    }
};
    
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

//Exports
module.exports = { 
    getAll,
    getById,
    getByField,
    createMovie,
    updateMovie,
    removeMovie
};