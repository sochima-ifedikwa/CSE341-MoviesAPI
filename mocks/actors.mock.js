// mocks/actors.mock.js

const getAll = async (req, res) => {
  res
    .status(200)
    .type('html')
    .send('<h1>Actors List (Mock Mode)</h1>');
};

const getById = async (req, res) => {
  const { id } = req.params;
  res
    .status(200)
    .type('html')
    .send(`<h1>Actor ${id} (Mock Mode)</h1>`);
};

const getByField = async (req, res) => {
  res
    .status(200)
    .type('html')
    .send('<p>Actors filtered by field (Mock Mode)</p>');
};

const createActor = async (req, res) => {
  res
    .status(201)
    .type('html')
    .send('<p>Actor created successfully (Mock Mode)</p>');
};

const updateActor = async (req, res) => {
  res
    .status(200)
    .type('html')
    .send('<p>Actor updated successfully (Mock Mode)</p>');
};

const removeActor = async (req, res) => {
  res
    .status(200)
    .type('html')
    .send('<p>Actor deleted successfully (Mock Mode)</p>');
};

module.exports = {
  getAll,
  getById,
  getByField,
  createActor,
  updateActor,
  removeActor
};
