// Import database connection module
const mongodb = require('../data/database');
// Import ObjectId from MongoDB for handling document IDs
const ObjectId  = require('mongodb').ObjectId;

// ======================= GET ALL ACTORS =======================
const getAll = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        // Fetch all actor documents from the 'actors' collection
        const result = await mongodb.getDatabase().db('movies').collection('actors').find();
        // Convert MongoDB cursor to an array
        const actors = await result.toArray();

        // If no actors found, return 404
        if (!actors || actors.length === 0) {
            return res.status(404).json({ message: 'No actors found!' });
        }

        // Return the actors in JSON format
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(actors);
    } catch (error) {
        // Handle any unexpected server errors
        res.status(500).json({message: 'Some error occurred while retrieving the actors.'});
    }
};   

// ======================= GET ACTOR BY ID =======================
const getById = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        // Convert the ID from the URL to a MongoDB ObjectId
        const actorId = new ObjectId(req.params.id);
        // Find the actor document with the matching ID
        const result = await mongodb.getDatabase().db('movies').collection('actors').find({ _id: actorId });
        const actors = await result.toArray();

        // If actor not found, return 404
        if (!actors || actors.length === 0) {
            return res.status(404).json({
                message: `Actor with ID ${req.params.id} not found`
            });
        }

        // Return the single actor object
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(actors[0]);
    } catch (error) {
        // Handle errors such as invalid ID or server issues
        res.status(500).json({message:error || 'Some error occurred while retrieving the actor.'});
    }  
};

// ======================= CREATE ACTOR =======================
const createActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        // Create new actor object from request body
        const newActor = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            knownFor: req.body.knownFor,
            awards: req.body.awards
        };

        // Insert new actor into MongoDB collection
        const result = await mongodb.getDatabase().db('movies').collection('actors').insertOne(newActor);

        // Confirm successful insertion
        if (result.acknowledged) {
            res.status(201).json({
                message: 'Contact created successfully',
                contactId: result.insertedId
            });
        } else {
            // Insertion failed for some reason
            res.status(500).json({ 
                message: 'Failed to create actor'
            });
        }
    } catch (error) {
        // Log and return server error
        console.error('Error creating actor:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the actor.' });
    }
};

// ======================= UPDATE ACTOR =======================
const updateActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        // Validate ID format before proceeding
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Actor ID format'
            });
        }

        // Convert ID to ObjectId and prepare update data
        const actorId = new ObjectId(req.params.id);
        const updatedActor = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            knownFor: req.body.knownFor,
            awards: req.body.awards
        };

        // Update actor document by ID
        const result = await mongodb.getDatabase().db('movies').collection('actors').updateOne(
            { _id: actorId }, 
            { $set: updatedActor }
        );

        // Handle cases where no matching actor found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Actor with ID ${req.params.id} not found`
            });
        }

        // Return success message depending on update result
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
        // Log and handle any update errors
        console.error('Error updating actor:', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the actor.' });
    }
};

// ======================= DELETE ACTOR =======================
const removeActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid actor ID format'
            });
        }

        // Convert ID to ObjectId and delete actor by ID
        const actorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('actors').deleteOne({ _id: actorId });

        // If no document deleted, actor doesn't exist
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Actor with ID ${req.params.id} not found`
            });
        }

        // Success response
        res.status(200).json({
            message: 'Actor deleted successfully'
        });
    } catch (error) {
        // Log and handle deletion errors
        console.error('Error deleting actor:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the actor.' });
    }
};

// ======================= EXPORTS =======================
// Export all route handler functions to be used in the router
module.exports = { 
    getAll,
    getById,
    createActor,
    updateActor,
    removeActor
};
