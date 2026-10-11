const prisma = require('../config/db');

const issueModel = {
  findByLandlord: (landlordId) =>
    prisma.issue.findMany({
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
      orderBy: { createdAt: 'desc' }
    }),

  findByTenant: (tenantId) =>
    prisma.issue.findMany({
      where: { tenancy: { tenantId } },
      include: {
        tenancy: {
          include: {
            room: { include: { property: { select: { id: true, title: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),

  findById: (id) =>
    prisma.issue.findUnique({
      where: { id },
      include: {
        tenancy: {
          include: {
            tenant: true,
            room: { include: { property: true } }
          }
        }
      }
    }),

  create: (data) =>
    prisma.issue.create({
      data,
      include: {
        tenancy: {
          include: { tenant: true, room: true }
        }
      }
    }),

  updateStatus: (id, status, resolvedAt = null) =>
    prisma.issue.update({
      where: { id },
      data: { status, resolvedAt }
    })
};

module.exports = issueModel;
