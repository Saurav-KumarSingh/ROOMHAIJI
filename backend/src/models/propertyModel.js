const prisma = require('../config/db');

const propertyModel = {
  findByLandlord: (landlordId) =>
    prisma.property.findMany({
      where: { landlordId },
      include: {
        rooms: {
          include: {
            tenancies: {
              where: { status: 'ACTIVE' },
              include: { tenant: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),

  findById: (id) =>
    prisma.property.findUnique({
      where: { id },
      include: {
        landlord: { select: { id: true, name: true, phone: true, email: true, upiId: true } },
        rooms: {
          include: {
            tenancies: {
              where: { status: 'ACTIVE' },
              include: { tenant: true }
            }
          }
        }
      }
    }),

  create: (data) => prisma.property.create({ data })
};

module.exports = propertyModel;
