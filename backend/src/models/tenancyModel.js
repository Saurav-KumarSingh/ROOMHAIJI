const prisma = require('../config/db');

const tenancyModel = {
  findActiveByLandlord: (landlordId) =>
    prisma.tenancy.findMany({
      where: {
        status: 'ACTIVE',
        room: { property: { landlordId } }
      },
      include: {
        tenant: true,
        room: { include: { property: true } },
        transactions: { orderBy: { transactionDate: 'desc' }, take: 5 }
      },
      orderBy: { createdAt: 'desc' }
    }),

  findActiveByTenant: (tenantId) =>
    prisma.tenancy.findFirst({
      where: { tenantId, status: 'ACTIVE' },
      include: {
        room: {
          include: {
            property: {
              include: {
                landlord: {
                  select: { id: true, name: true, phone: true, upiId: true, avatarColor: true }
                }
              }
            }
          }
        },
        transactions: { orderBy: { transactionDate: 'desc' }, take: 10 },
        issues: { orderBy: { createdAt: 'desc' } }
      }
    }),

  findById: (id) =>
    prisma.tenancy.findUnique({
      where: { id },
      include: {
        tenant: true,
        room: { include: { property: true } }
      }
    })
};

module.exports = tenancyModel;
