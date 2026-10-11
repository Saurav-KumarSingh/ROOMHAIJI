const tenancyModel = require('../models/tenancyModel');
const roomModel = require('../models/roomModel');
const prisma = require('../config/db');

const tenancyController = {
  getTenants: async (req, res, next) => {
    try {
      const activeTenancies = await tenancyModel.findActiveByLandlord(req.user.id);

      const data = activeTenancies.map((t) => ({
        tenancyId: t.id,
        tenantId: t.tenant.id,
        name: t.tenant.name,
        phone: t.tenant.phone,
        email: t.tenant.email,
        roomNumber: t.room.roomNumber,
        propertyTitle: t.room.property.title,
        propertyId: t.room.property.id,
        agreedRent: t.agreedRent,
        startDate: t.startDate,
        status: t.status,
        recentPayments: t.transactions
      }));

      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  onboardTenant: async (req, res, next) => {
    try {
      const { name, phone, email, roomId, agreedRent, startDate } = req.body;

      if (!name || !phone || !roomId || agreedRent === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Tenant name, phone, roomId, and agreedRent are required'
        });
      }

      const room = await roomModel.findById(roomId);
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }

      if (room.property.landlordId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied: You do not own this property' });
      }

      if (room.isOccupied) {
        return res.status(400).json({ success: false, message: 'Room is already occupied' });
      }

      const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;

      const result = await prisma.$transaction(async (tx) => {
        let tenantUser = await tx.user.findUnique({ where: { phone: normalizedPhone } });
        if (!tenantUser) {
          tenantUser = await tx.user.create({
            data: {
              name,
              phone: normalizedPhone,
              email: email || null,
              role: 'TENANT',
              avatarColor: '#10B981'
            }
          });
        }

        const tenancy = await tx.tenancy.create({
          data: {
            tenantId: tenantUser.id,
            roomId,
            agreedRent: Number(agreedRent),
            startDate: startDate ? new Date(startDate) : new Date(),
            status: 'ACTIVE'
          },
          include: {
            tenant: true,
            room: { include: { property: true } }
          }
        });

        await tx.room.update({
          where: { id: roomId },
          data: { isOccupied: true }
        });

        return tenancy;
      });

      return res.status(201).json({
        success: true,
        message: 'Tenant onboarded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  getMyTenancy: async (req, res, next) => {
    try {
      const tenancy = await tenancyModel.findActiveByTenant(req.user.id);
      if (!tenancy) {
        return res.status(404).json({ success: false, message: 'No active lease found' });
      }

      return res.status(200).json({ success: true, data: tenancy });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tenancyController;
