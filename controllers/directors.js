const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        const result = await mongodb.getDatabase().db('movies').collection('directors').find();
        const directors = await result.toArray();

        if (!directors|| directors.length === 0) {
            return res.status(404).json({ message: 'No directors found!' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(directors);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the directors.'});
    }
};   

const getById = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        const directorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('directors').find({ _id: directorId });
        const directors = await result.toArray();

        if (!directors|| directors.length === 0) {
            return res.status(404).json({
                message: `Director with ID ${req.params.id} not found`
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(directors[0]);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the director.'});
    }  
};

const getByField = async (req, res) => {//We can filter by any field with this same fuction
    //#swagger.tags = ['Directors']
    console.log(req.query);
    try {
        const result = await mongodb.getDatabase().db('movies').collection('directors').find(req.query);
        const directors = await result.toArray();

        if (!directors|| directors.length === 0) {
            return res.status(404).json({ message: 'No directors found!' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(directors);
    } catch (error) {
        res.status(500).json({message:error.message || 'Some error occurred while retrieving directors.'});
    }
}

//CRUD Operations
const createDirector = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        const newDirector = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            notableWorks: req.body.notableWorks,
            awards: req.body.awards
        };

        const result = await mongodb.getDatabase().db('movies').collection('directors').insertOne(newDirector);

        if (result.acknowledged) {
            res.status(201).json({
                message: 'Director created successfully',
                directorId: result.insertedId
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to create Director'
            });
        }
    } catch (error) {
        console.error('Error creating Director:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the director.' });
    }
};

const updateDirector = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Director ID format'
            });
        }
        const directorId = new ObjectId(req.params.id);
        const updatedDirector = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            notableWorks: req.body.notableWorks,
            awards: req.body.awards
        };

        const result = await mongodb.getDatabase().db('movies').collection('directors').updateOne(
            { _id: directorId }, 
            { $set: updatedDirector }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Director with ID ${req.params.id} not found`
            });
        }

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Actor updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the actor'
            });
        }
    } catch (error) {
        console.error('Error updating director:', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the director.' });
    }
};
    
const removeDirector = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Director ID format'
            });
        }

        const directorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('directors').deleteOne({ _id: directorId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Director with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            message: 'Director deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting director:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the director.' });
    }
};

//Exports
module.exports = { 
    getAll,
    getById,
    getByField,
    createDirector,
    updateDirector,
    removeDirector
};