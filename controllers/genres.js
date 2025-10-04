const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    //#swagger.tags = ['Genres']
    try {
        const result = await mongodb.getDatabase().db('movies').collection('genres').find();
        const genres = await result.toArray();

        if (!genres || genres.length === 0) {
            return res.status(404).json({ message: 'No genres found!' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the genres.'});
    }
};   

const getById = async (req, res) => {
    //#swagger.tags = ['Genres']
    try {
        const genreId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('genres').find({ _id: genreId });
        const genres = await result.toArray();

        if (!genres || genres.length === 0) {
            return res.status(404).json({
                message: `Genre with ID ${req.params.id} not found`
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(genres[0]);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the genre.'});
    }
};   


const getByField = async (req, res) => {//We can filter by any field with this same fuction
    //#swagger.tags = ['Genres']
    console.log(req.query);
    try {
        const result = await mongodb.getDatabase().db('movies').collection('genres').find(req.query);
        const genres = await result.toArray();

        if (!genres || genres.length === 0) {
            return res.status(404).json({ message: 'No genres found!' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(genres[0]);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the genre.'});
    }  
}

//CRUD Operations
const createGenre = async (req, res) => {
    //#swagger.tags = ['Genres']
    try {
        const newGenre = { // *******No idea what other fields we could add to this collection******
            genreName: req.body.genreName,
            description: req.body.description
        };

        const result = await mongodb.getDatabase().db('movies').collection('genres').insertOne(newGenre);

        if (result.acknowledged) {
            res.status(201).json({
                message: 'Genre created successfully',
                genreId: result.insertedId
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to create Director'
            });
        }
    } catch (error) {
        console.error('Error creating Genre:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the genre.' });
    }
};

const updateGenre = async (req, res) => {
    //#swagger.tags = ['Genres']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Genre ID format'
            });
        }
        const genreId = new ObjectId(req.params.id);
        const updatedGenre = {
            genreName: req.body.genreName,
            description: req.body.description
        };

        const result = await mongodb.getDatabase().db('movies').collection('genres').updateOne(
            { _id: genreId }, 
            { $set: updatedGenre }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Genre with ID ${req.params.id} not found`
            });
        }

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Actor updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the genre'
            });
        }
    } catch (error) {
        console.error('Error updating genre:', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the genre.' });
    }
};
    
const removeGenre = async (req, res) => {
    //#swagger.tags = ['Genres']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Genre ID format'
            });
        }

        const genreId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('genres').deleteOne({ _id: genreId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Genre with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            message: 'Genre deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting genre:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the genre.' });
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