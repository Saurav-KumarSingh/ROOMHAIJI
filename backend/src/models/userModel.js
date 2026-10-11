const prisma = require('../config/db');

const userModel = {
  findById: (id) => prisma.user.findUnique({ where: { id } }),
  findByPhone: (phone) => prisma.user.findUnique({ where: { phone } }),
  create: (data) => prisma.user.create({ data }),
  update: (id, data) => prisma.user.update({ where: { id }, data })
};

module.exports = userModel;
