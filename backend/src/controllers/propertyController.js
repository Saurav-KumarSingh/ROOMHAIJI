const propertyModel = require('../models/propertyModel');
const roomModel = require('../models/roomModel');

const propertyController = {
  getProperties: async (req, res, next) => {
    try {
      const properties = await propertyModel.findByLandlord(req.user.id);

      const data = properties.map((prop) => {
        const totalRooms = prop.rooms.length;
        const occupiedRooms = prop.rooms.filter((r) => r.isOccupied).length;
        const totalExpectedRent = prop.rooms.reduce((acc, r) => acc + Number(r.expectedRent || 0), 0);

        return {
          ...prop,
          stats: {
            totalRooms,
            occupiedRooms,
            vacantRooms: totalRooms - occupiedRooms,
            totalExpectedRent
          }
        };
      });

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  createProperty: async (req, res, next) => {
    try {
      const { title, address, iconBg } = req.body;
      if (!title || !address) {
        return res.status(400).json({ success: false, message: 'Title and address are required' });
      }

      const property = await propertyModel.create({
        landlordId: req.user.id,
        title,
        address,
        iconBg: iconBg || '#1E1B4B'
      });

      return res.status(201).json({
        success: true,
        message: 'Property created',
        data: property
      });
    } catch (error) {
      next(error);
    }
  },

  getPropertyById: async (req, res, next) => {
    try {
      const property = await propertyModel.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }

      if (req.user.role === 'LANDLORD' && property.landlordId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied: Not your property' });
      }

      const totalRooms = property.rooms.length;
      const occupiedRooms = property.rooms.filter((r) => r.isOccupied).length;

      return res.status(200).json({
        success: true,
        data: {
          ...property,
          stats: {
            totalRooms,
            occupiedRooms,
            vacantRooms: totalRooms - occupiedRooms
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },

  addRoom: async (req, res, next) => {
    try {
      const { roomNumber, expectedRent } = req.body;
      if (!roomNumber || expectedRent === undefined) {
        return res.status(400).json({ success: false, message: 'Room number and expected rent are required' });
      }

      const property = await propertyModel.findById(req.params.id);
      if (!property) {
        return res.status(404).json({ success: false, message: 'Property not found' });
      }

      if (property.landlordId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied: Not your property' });
      }

      const room = await roomModel.create({
        propertyId: req.params.id,
        roomNumber: String(roomNumber),
        expectedRent: Number(expectedRent),
        isOccupied: false
      });

      return res.status(201).json({
        success: true,
        message: 'Room added successfully',
        data: room
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = propertyController;
