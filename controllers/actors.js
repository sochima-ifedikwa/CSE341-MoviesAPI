const mongodb = require('../data/database');
const ObjectId  = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        const result = await mongodb.getDatabase().db('movies').collection('actors').find();
        const actors = await result.toArray();

        if (!actors || actors.length === 0) {
            return res.status(404).json({ message: 'No actors found!' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(actors);
    } catch (error) {
        res.status(500).json({message: 'Some error occurred while retrieving the actors.'});
    }
};   

const getById = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        const actorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('actors').find({ _id: actorId });
        const actors = await result.toArray();

        if (!actors || actors.length === 0) {
            return res.status(404).json({
                message: `Actor with ID ${req.params.id} not found`
            });
        }

        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(actors[0]);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the actor.'});
    }  
};

const getByField = async (req, res) => {//We can filter by any field with this same fuction
    //#swagger.tags = ['Actors']
    console.log(req.query);
    try {
        const result = await mongodb.getDatabase().db('movies').collection('actors').find(req.query);
        const actors = await result.toArray();

        if (!actors || actors.length === 0) {
            return res.status(404).json({ message: 'No actors found!' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(actors[0]);
    } catch (error) {
        res.status(500).json({message:error || 'Some error occurred while retrieving the actor.'});
    }  
}

//CRUD Operations
const createActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        const newActor = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            knownFor: req.body.knownFor,
            awards: req.body.awards
        };

        const result = await mongodb.getDatabase().db('movies').collection('actors').insertOne(newActor);

        if (result.acknowledged) {
            res.status(201).json({
                message: 'Contact created successfully',
                contactId: result.insertedId
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to create actor'
            });
        }
    } catch (error) {
        console.error('Error creating actor:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the actor.' });
    }
};

const updateActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Actor ID format'
            });
        }
        const actorId = new ObjectId(req.params.id);
        const updatedActor = {
        name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            knownFor: req.body.knownFor,
            awards: req.body.awards
        };

        const result = await mongodb.getDatabase().db('movies').collection('actors').updateOne(
            { _id: actorId }, 
            { $set: updatedActor }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Actor with ID ${req.params.id} not found`
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
        console.error('Error updating actor:', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the actor.' });
    }
};
    
const removeActor = async (req, res) => {
    //#swagger.tags = ['Actors']
        try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid actor ID format'
            });
        }

        const actorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('actors').deleteOne({ _id: actorId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Actor with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            message: 'Actor deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting actor:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the actor.' });
    }
};

//Exports
module.exports = { 
    getAll,
    getById,
    getByField,
    createActor,
    updateActor,
    removeActor
};