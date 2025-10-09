// Import database connection module
const mongodb = require('../data/database');
// Import ObjectId from MongoDB to handle unique document IDs
const { ObjectId } = require('mongodb');

// ======================= GET ALL DIRECTORS =======================
const getAll = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Retrieve all directors from the "directors" collection
        const result = await mongodb.getDatabase().db('movies').collection('directors').find();
        const directors = await result.toArray();

        // Check if any directors exist
        if (!directors || directors.length === 0) {
            return res.status(404).json({ message: 'No directors found!' });
        }

        // Respond with the list of directors
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(directors);
    } catch (error) {
        // Handle unexpected server or database errors
        res.status(500).json({message:error || 'Some error occurred while retrieving the directors.'});
    }
};   

// ======================= GET DIRECTOR BY ID =======================
const getById = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Convert the ID from request params to a valid ObjectId
        const directorId = new ObjectId(req.params.id);
        // Search for the director with the matching ID
        const result = await mongodb.getDatabase().db('movies').collection('directors').find({ _id: directorId });
        const directors = await result.toArray();

        // If director not found, return 404
        if (!directors || directors.length === 0) {
            return res.status(404).json({
                message: `Director with ID ${req.params.id} not found`
            });
        }

        // Respond with the found director
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(directors[0]);
    } catch (error) {
        // Handle any possible errors
        res.status(500).json({message:error || 'Some error occurred while retrieving the director.'});
    }  
};

// ======================= GET DIRECTOR(S) BY FIELD =======================
const getByField = async (req, res) => {
    // This allows dynamic filtering by any field using query parameters
    //#swagger.tags = ['Directors']
    console.log(req.query);
    try {
        // Find directors matching the query filters
        const result = await mongodb.getDatabase().db('movies').collection('directors').find(req.query);
        const directors = await result.toArray();

        // Handle case where no matching records are found
        if (!directors || directors.length === 0) {
            return res.status(404).json({ message: 'No directors found!' });
        }

        // Respond with the filtered directors
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(directors);
    } catch (error) {
        // Handle query or database errors
        res.status(500).json({message:error.message || 'Some error occurred while retrieving directors.'});
    }
};

// ======================= CREATE DIRECTOR =======================
const createDirector = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Create a new director object based on the request body
        const newDirector = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            notableWorks: req.body.notableWorks,
            awards: req.body.awards
        };

        // Insert new director into the "directors" collection
        const result = await mongodb.getDatabase().db('movies').collection('directors').insertOne(newDirector);

        // Check if insertion was successful
        if (result.acknowledged) {
            res.status(201).json({
                message: 'Director created successfully',
                directorId: result.insertedId
            });
        } else {
            // If not acknowledged, insertion failed
            res.status(500).json({ 
                message: 'Failed to create Director'
            });
        }
    } catch (error) {
        // Log and return error response
        console.error('Error creating Director:', error);
        res.status(500).json({ message:error || 'Some error occurred while creating the director.' });
    }
};

// ======================= UPDATE DIRECTOR =======================
const updateDirector = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Ensure a valid MongoDB ObjectId format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Director ID format'
            });
        }

        // Convert ID and prepare updated data
        const directorId = new ObjectId(req.params.id);
        const updatedDirector = {
            name: req.body.name,
            birthYear: req.body.birthYear,
            nationality: req.body.nationality,
            notableWorks: req.body.notableWorks,
            awards: req.body.awards
        };

        // Perform the update operation
        const result = await mongodb.getDatabase().db('movies').collection('directors').updateOne(
            { _id: directorId }, 
            { $set: updatedDirector }
        );

        // Handle case where no matching document is found
        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Director with ID ${req.params.id} not found`
            });
        }

        // Handle response depending on modification success
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
        // Log and return any update-related errors
        console.error('Error updating director:', error);
        res.status(500).json({ message:error || 'Some error occurred while updating the director.' });
    }
};
    
// ======================= DELETE DIRECTOR =======================
const removeDirector = async (req, res) => {
    //#swagger.tags = ['Directors']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid Director ID format'
            });
        }

        // Convert ID and delete the matching document
        const directorId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('movies').collection('directors').deleteOne({ _id: directorId });

        // Handle case where no document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Director with ID ${req.params.id} not found`
            });
        }

        // Respond with successful deletion message
        res.status(200).json({
            message: 'Director deleted successfully'
        });
    } catch (error) {
        // Log and handle errors during deletion
        console.error('Error deleting director:', error);
        res.status(500).json({ message: error || 'Some error occurred while deleting the director.' });
    }
};

// ======================= EXPORTS =======================
// Export all route handler functions for router usage
module.exports = { 
    getAll,
    getById,
    getByField,
    createDirector,
    updateDirector,
    removeDirector
};
