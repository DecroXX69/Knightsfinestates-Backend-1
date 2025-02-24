// controllers/propertyController.js
const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  try {
    console.log('Query params:', req.query); // Debugging
    const { location, area, type, sort } = req.query; // Include 'sort' here
    const query = {};
    if (location) query.location = location;
    if (area) query.area = area;
    if (type) query.type = type;

    let sortOptions = { createdAt: -1 }; // Default sort by createdAt descending
    if (sort) {
      const [field, order] = sort.split('=');
      sortOptions = {};
      sortOptions[field] = order === '1' ? 1 : -1;
    }

    const properties = await Property.find(query)
      .sort(sortOptions) // Use the dynamically built sortOptions
      .limit(12);
    console.log('Properties:', properties); // Debugging
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error); // Debugging
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching property' });
  }
};