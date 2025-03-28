// controllers/propertyController.js
const Property = require('../models/Property');

const { deleteS3Object, deleteS3Objects } = require('../utils/s3DeleteHelper'); // Adjust path
// controllers/propertyController.js
exports.getProperties = async (req, res) => {
  try {
    console.log('Query params:', req.query);
    const { location, area, type, Trend, sort } = req.query; // Add Trend to destructuring
    const query = { status: 'approved' }; // Only show approved properties by default

    if (location) query.location = location;
    if (area) query.area = area;
    if (type) query.type = type;
    if (Trend) {
      query.Trend = { $regex: new RegExp(`^${Trend}$`, 'i') }; // Case-insensitive match
    }

    let sortOptions = { createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split('=');
      sortOptions = {};
      sortOptions[field] = order === '1' ? 1 : -1;
    }

    const properties = await Property.find(query)
      .sort(sortOptions)
      .limit(12);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

// Update property view count
exports.incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.viewCount += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ error: 'Error incrementing view count' });
  }
};

// controllers/propertyController.js
// controllers/propertyController.js
exports.updateSubStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { subStatus, possessionDate } = req.body; // Add possessionDate to request body
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.subStatus = subStatus;
    if (subStatus === 'Under Construction' && possessionDate) {
      property.possessionDate = new Date(possessionDate); // Save the possession date
    } else if (subStatus !== 'Under Construction') {
      property.possessionDate = null; // Clear possession date if not under construction
    }

    await property.save();
    res.json(property);
  } catch (error) {
    console.error('Error updating subStatus:', error);
    res.status(500).json({ error: 'Error updating subStatus' });
  }
};

// controllers/propertyController.js
exports.updateTrend = async (req, res) => {
  try {
    const { id } = req.params;
    const { Trend } = req.body;
    
    // Validate that the Trend value is valid
    if (!['normal', 'Hot'].includes(Trend)) {
      return res.status(400).json({ error: 'Invalid trend value. Must be "normal" or "Hot"' });
    }
    
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    property.Trend = Trend;
    await property.save();

    res.json(property);
  } catch (error) {
    console.error('Error updating property trend:', error);
    res.status(500).json({ error: 'Error updating property trend' });
  }
};
// controllers/propertyController.js
exports.getPropertiesWithViewCount = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'approved' })
      .select('buildingName location viewCount')
      .sort({ viewCount: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties with view count:', error);
    res.status(500).json({ error: 'Error fetching properties with view count' });
  }
};
// propertyController.js
// controllers/propertyController.js
exports.createProperty = async (req, res) => {
  try {
    // The req.body should already contain the S3 URLs from the frontend
    const newPropertyData = {
        ...req.body,
        status: 'pending' // Set status to pending by default
    };

    // Validate that necessary URLs are present (basic check)
    if (!newPropertyData.image) {
         return res.status(400).json({ error: 'Main image URL is required.' });
    }
    // Add more validation as needed for other fields

    const newProperty = await Property.create(newPropertyData);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
     if (error.name === 'ValidationError') {
         return res.status(400).json({ error: error.message });
     }
    res.status(400).json({ error: 'Failed to create property' });
  }
};

// controllers/propertyController.js
exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    res.status(500).json({ error: 'Error fetching pending properties' });
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

exports.getSalePropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id,
      type: 'sale'
    });
    
    if (!property) {
      return res.status(404).json({ error: 'Sale property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching sale property:', error);
    res.status(500).json({ error: 'Error fetching sale property' });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching all properties:', error);
    res.status(500).json({ error: 'Error fetching all properties' });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ error: 'Error approving property' });
  }
};

// Reject a property
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ error: 'Error rejecting property' });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  try {
      const propertyId = req.params.id;
      const incomingData = req.body;

      const existingProperty = await Property.findById(propertyId);
      if (!existingProperty) {
          return res.status(404).json({ error: 'Property not found' });
      }

      // --- S3 Deletion Logic for Replaced/Removed Images ---
      const oldUrls = [];
      if (existingProperty.image) oldUrls.push(existingProperty.image);
      if (existingProperty.images) oldUrls.push(...existingProperty.images);
      if (existingProperty.floorPlan) oldUrls.push(...existingProperty.floorPlan);
      // Add brochureURL, LegalDocURL if needed

      const newUrls = [];
      if (incomingData.image) newUrls.push(incomingData.image);
      if (incomingData.images) newUrls.push(...incomingData.images);
      if (incomingData.floorPlan) newUrls.push(...incomingData.floorPlan);
      // Add brochureURL, LegalDocURL if needed

      // Find URLs that are in oldUrls but not in newUrls
      const urlsToDelete = oldUrls.filter(url => !newUrls.includes(url));

      // Only delete if there are URLs marked for deletion
      if (urlsToDelete.length > 0) {
           await deleteS3Objects(urlsToDelete);
      }
      // --- End S3 Deletion Logic ---

      // Ensure status is not overwritten unless explicitly provided in update
      if (!incomingData.status) {
          incomingData.status = existingProperty.status;
      }
      // Add updatedAt timestamp
       incomingData.updatedAt = new Date();


      const updatedProperty = await Property.findByIdAndUpdate(
          propertyId,
          incomingData,
          { new: true, runValidators: true } // Ensure validation runs on update
      );

      res.json(updatedProperty);
  } catch (error) {
      console.error('Error updating property:', error);
      // Handle potential validation errors from Mongoose
      if (error.name === 'ValidationError') {
           return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error updating property' });
  }
};



exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // --- S3 Deletion Logic ---
        const urlsToDelete = [];
        if (property.image) urlsToDelete.push(property.image);
        if (property.images && Array.isArray(property.images)) {
            urlsToDelete.push(...property.images);
        }
        if (property.floorPlan && Array.isArray(property.floorPlan)) {
            urlsToDelete.push(...property.floorPlan);
        }
        // Add brochureURL, LegalDocURL if they are also S3 uploads managed this way
        // if (property.brochureURL && property.brochureURL.includes(S3_BUCKET_NAME)) urlsToDelete.push(property.brochureURL);
        // if (property.LegalDocURL && property.LegalDocURL.includes(S3_BUCKET_NAME)) urlsToDelete.push(property.LegalDocURL);

        await deleteS3Objects(urlsToDelete);
        // --- End S3 Deletion Logic ---

        await Property.findByIdAndDelete(req.params.id);

        res.json({ message: 'Property and associated files deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Error deleting property' });
    }
};

// New handler for offplan properties
exports.getOffplanPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id,
      type: 'offplan'
    });
    
    if (!property) {
      return res.status(404).json({ error: 'Offplan property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching offplan property:', error);
    res.status(500).json({ error: 'Error fetching offplan property' });
  }
};