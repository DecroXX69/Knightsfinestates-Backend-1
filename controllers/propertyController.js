// controllers/propertyController.js
const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
  try {
    const { location, area, type, propertyType, bedrooms } = req.query;
    const query = {};
    
    // Add filters only if they are provided
    if (location) query.location = location;
    if (area) query.area = area;
    if (type) query.type = type;
    if (propertyType) query.propertyType = propertyType;
    if (bedrooms) query.bedrooms = bedrooms;

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(12);

    res.json(properties);
  } catch (error) {
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