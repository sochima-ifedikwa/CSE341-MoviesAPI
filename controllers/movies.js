const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('movies').find();
        result.toArray().then((movies) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(movies);
        });
    } catch (err) {
            res.status(500).json(result.error || 'Some error occurred while retrieving the movies.');
    }
    
};   

const getById = async (req, res) => {
    try {
        const movieId = new ObjectId(req.params.id);
        const database = await mongodb.getDatabase();
        const result = await database.collection('movies').find({_id: movieId});
        result.toArray().then((movies) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(movies[0]);
        });
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while retrieving the movie.');
    }  
};

const getByField = async (req, res) => {//We can filter by any field with this same fuction
    console.log(req.query);
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('movies').find(req.query);  
        result.toArray().then((movies) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(movies);
        }); 
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while retrieving the movie.');
    }  
}

//CRUD Operations
const createMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    const newMovie = {
        tittle: req.body.tittle,
        releaseDate: req.body.releaseDate, //MM/DD/YYYY
        director: req.body.director,
        actors: req.body.actors, //this is an array
        producer: req.body.producer,
        country: req.body.country,
        genres: req.body.genres, //this is an array
        category: req.body.category
    };
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('movies').insertOne(newMovie);
        if (result.acknowledged !== 1) {
            res.status(201).json(result.insertedId);
        } 
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while creating the movie.');
    } 
};

const updateMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    const movieId = new ObjectId(req.params.id);
    const updatedMovie = {
        tittle: req.body.tittle,
        releaseDate: req.body.releaseDate, //MM/DD/YYYY
        director: req.body.director,
        actors: req.body.actors, //this is an array
        producer: req.body.producer,
        country: req.body.country,
        genres: req.body.genres, //this is an array
        category: req.body.category
    };
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('movies').updateOne({_id: movieId}, {$set: updatedMovie});
        if (result.modifiedCount !== 1) {
            throw err;
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while updating the movie.');
    }
};
    
const removeMovie = async (req, res) => {
    //#swagger.tags = ['Movies']
    try {
        const movieId = new ObjectId(req.params.id);
        const database = await mongodb.getDatabase();
        const result = await database.collection('movies').deleteOne({_id: movieId});
        if (result.deletedCount !== 1) {
            throw err;
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while deleting the movie.'); 
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