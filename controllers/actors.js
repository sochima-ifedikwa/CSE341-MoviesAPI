const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('actors').find();
        result.toArray().then((actors) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(actors);
        });
    } catch (err) {
            res.status(500).json(result.error || 'Some error occurred while retrieving the actors.');
    }
    
};   

const getById = async (req, res) => {
    try {
        const actorId = new ObjectId(req.params.id);
        const database = await mongodb.getDatabase();
        const result = await database.collection('actors').find({_id: actorId});
        result.toArray().then((actors) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(actors[0]);
        });
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while retrieving the actor.');
    }  
};

const getByField = async (req, res) => {//We can filter by any field with this same fuction
    console.log(req.query);
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('actors').find(req.query);  
        result.toArray().then((actors) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(actors);
        }); 
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while retrieving the actor.');
    }  
}

//CRUD Operations
const createActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    const newActor = {
        name: req.body.name,
        birthYear: req.body.birthYear,
        nationality: req.body.nationality,
        knownFor: req.body.kownFor,
        awards: req.body.awards
    };
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('actors').insertOne(newActor);
        if (result.acknowledged !== 1) {
            res.status(201).json(result.insertedId);
        } 
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while creating the actor.');
    } 
};

const updateActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    const actorId = new ObjectId(req.params.id);
    const updatedActor = {
        name: req.body.name,
        birthYear: req.body.birthYear,
        nationality: req.body.nationality,
        knownFor: req.body.kownFor,
        awards: req.body.awards
    };
    try {
        const database = await mongodb.getDatabase();
        const result = await database.collection('actors').updateOne({_id: actorId}, {$set: updatedActor});
        if (result.modifiedCount !== 1) {
            throw err;
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while updating the actor.');
    }
};
    
const removeActor = async (req, res) => {
    //#swagger.tags = ['Actors']
    try {
        const actorId = new ObjectId(req.params.id);
        const database = await mongodb.getDatabase();
        const result = await database.collection('actors').deleteOne({_id: actorId});
        if (result.deletedCount !== 1) {
            throw err;
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json(result.error || 'Some error occurred while deleting the actor.'); 
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