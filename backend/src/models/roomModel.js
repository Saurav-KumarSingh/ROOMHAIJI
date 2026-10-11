const prisma = require('../config/db');

const roomModel = {
  findById: (id) =>
    prisma.room.findUnique({
      where: { id },
      include: { property: true }
    }),

  create: (data) => prisma.room.create({ data })
};

module.exports = roomModel;
