const prisma = require('../config/db');

const transactionModel = {
  findByLandlord: (landlordId) =>
    prisma.transaction.findMany({
      where: {
        tenancy: { room: { property: { landlordId } } }
      },
      include: {
        tenancy: {
          include: {
            tenant: { select: { id: true, name: true, phone: true } },
            room: { include: { property: { select: { id: true, title: true } } } }
          }
        }
      },
      orderBy: { transactionDate: 'desc' }
    }),

  findByTenant: (tenantId) =>
    prisma.transaction.findMany({
      where: { tenancy: { tenantId } },
      include: {
        tenancy: {
          include: {
            room: {
              include: {
                property: {
                  include: {
                    landlord: { select: { id: true, name: true, phone: true, upiId: true } }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { transactionDate: 'desc' }
    }),

  findById: (id) =>
    prisma.transaction.findUnique({
      where: { id },
      include: {
        tenancy: {
          include: {
            tenant: true,
            room: { include: { property: { include: { landlord: true } } } }
          }
        }
      }
    }),

  create: (data) =>
    prisma.transaction.create({
      data,
      include: {
        tenancy: {
          include: {
            tenant: true,
            room: { include: { property: true } }
          }
        }
      }
    })
};

module.exports = transactionModel;
