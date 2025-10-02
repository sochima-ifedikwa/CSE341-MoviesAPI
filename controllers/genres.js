const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('genres').find();
        result.toArray().then((genres) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(genres);
        });
    } catch (err) {
            res.status(500).json(result.error || 'Some error occurred while retrieving the genres.');
    }
    
};   

const getById = async (req, res) => {
    try {
        const genreId = new ObjectId(req.params.id);
        const database = await mongodb.getDatabase();
        const result = await database.collection('genres').find({_id: genreId});
        result.toArray().then((genres) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(genres[0]);
        });
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while retrieving the genre.');
    }  
};

const getByField = async (req, res) => {//We can filter by any field with this same fuction
    console.log(req.query);
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('genres').find(req.query);  
        result.toArray().then((genres) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(genres);
        }); 
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while retrieving the genre.');
    }  
}

//CRUD Operations
const createGenre = async (req, res) => {
    //#swagger.tags = ['Genres']
    const newGenre = { // *******No idea what other fields we could add to this collection******
        genreName: req.body.genreName,
        description: req.body.description
    };
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('genres').insertOne(newGenre);
        if (result.acknowledged !== 1) {
            res.status(201).json(result.insertedId);
        } 
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while creating the genre.');
    } 
};

const updateGenre = async (req, res) => {
    //#swagger.tags = ['Genres']
    const genreId = new ObjectId(req.params.id);
    const updatedGenre = {
        genreName: req.body.genreName,
        description: req.body.description
    };
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('genres').updateOne({_id: genreId}, {$set: updatedGenre});
        if (result.modifiedCount !== 1) {
            throw err;
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while updating the genre.');
    }
};
    
const removeGenre = async (req, res) => {
    //#swagger.tags = ['Genres']
    try {
        const genreId = new ObjectId(req.params.id);
        const database = await mongodb.getDatabase();
        const result = await database.collection('genres').deleteOne({_id: genreId});
        if (result.deletedCount !== 1) {
            throw err;
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while deleting the genre.'); 
    }
};


//Exports
module.exports = { 
    getAll,
    getById,
    getByField,
    createGenre,
    updateGenre,
    removeGenre
};