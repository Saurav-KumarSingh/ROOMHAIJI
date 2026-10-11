const transactionModel = require('../models/transactionModel');
const tenancyModel = require('../models/tenancyModel');
const prisma = require('../config/db');

const transactionController = {
  getTransactions: async (req, res, next) => {
    try {
      const transactions = req.user.role === 'LANDLORD'
        ? await transactionModel.findByLandlord(req.user.id)
        : await transactionModel.findByTenant(req.user.id);

      return res.status(200).json({ success: true, data: transactions });
    } catch (error) {
      next(error);
    }
  },

  recordCashPayment: async (req, res, next) => {
    try {
      const { tenancyId, amount, forMonth, transactionDate, referenceId } = req.body;

      if (!tenancyId || amount === undefined || !forMonth) {
        return res.status(400).json({
          success: false,
          message: 'tenancyId, amount, and forMonth are required'
        });
      }

      const tenancy = await tenancyModel.findById(tenancyId);
      if (!tenancy) {
        return res.status(404).json({ success: false, message: 'Tenancy not found' });
      }

      if (tenancy.room.property.landlordId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied: Not your property' });
      }

      const transaction = await transactionModel.create({
        tenancyId,
        amount: Number(amount),
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        forMonth,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        referenceId: referenceId || `CASH-${Date.now()}`
      });

      return res.status(201).json({
        success: true,
        message: 'Cash payment recorded',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  },

  verifyUpiPayment: async (req, res, next) => {
    try {
      const { tenancyId, amount, forMonth, referenceId } = req.body;

      if (!tenancyId || amount === undefined || !forMonth || !referenceId) {
        return res.status(400).json({
          success: false,
          message: 'tenancyId, amount, forMonth, and referenceId are required'
        });
      }

      const tenancy = await tenancyModel.findById(tenancyId);
      if (!tenancy) {
        return res.status(404).json({ success: false, message: 'Tenancy not found' });
      }

      const isTenant = tenancy.tenantId === req.user.id;
      const isLandlord = tenancy.room.property.landlordId === req.user.id;
      if (!isTenant && !isLandlord) {
        return res.status(403).json({ success: false, message: 'Access denied to this tenancy' });
      }

      const transaction = await transactionModel.create({
        tenancyId,
        amount: Number(amount),
        paymentMethod: 'UPI',
        status: 'COMPLETED',
        forMonth,
        transactionDate: new Date(),
        referenceId
      });

      return res.status(201).json({
        success: true,
        message: 'UPI payment recorded',
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  },

  getDueTransactions: async (req, res, next) => {
    try {
      const now = new Date();
      const currentMonthStr = `${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

      if (req.user.role === 'LANDLORD') {
        const activeTenancies = await tenancyModel.findActiveByLandlord(req.user.id);
        const tenancyIds = activeTenancies.map((t) => t.id);

        // Fetch all completed transactions for current month in a single query
        const paidThisMonth = await prisma.transaction.findMany({
          where: {
            tenancyId: { in: tenancyIds },
            forMonth: currentMonthStr,
            status: 'COMPLETED'
          },
          select: { tenancyId: true }
        });

        const paidSet = new Set(paidThisMonth.map((p) => p.tenancyId));

        const dueList = activeTenancies
          .filter((t) => !paidSet.has(t.id))
          .map((t) => ({
            tenancyId: t.id,
            tenantName: t.tenant.name,
            tenantPhone: t.tenant.phone,
            roomNumber: t.room.roomNumber,
            propertyTitle: t.room.property.title,
            amountDue: t.agreedRent,
            forMonth: currentMonthStr,
            status: 'OVERDUE'
          }));

        return res.status(200).json({
          success: true,
          data: { forMonth: currentMonthStr, totalDueCount: dueList.length, dueList }
        });
      } else {
        const tenancy = await tenancyModel.findActiveByTenant(req.user.id);
        if (!tenancy) {
          return res.status(200).json({ success: true, data: null });
        }

        const completedTx = await prisma.transaction.findFirst({
          where: { tenancyId: tenancy.id, forMonth: currentMonthStr, status: 'COMPLETED' }
        });

        return res.status(200).json({
          success: true,
          data: {
            forMonth: currentMonthStr,
            isPaid: !!completedTx,
            amountDue: completedTx ? 0 : tenancy.agreedRent,
            landlordUpi: tenancy.room.property.landlord.upiId,
            landlordName: tenancy.room.property.landlord.name,
            transaction: completedTx
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },

  getReceipt: async (req, res, next) => {
    try {
      const { transactionId } = req.params;
      const tx = await transactionModel.findById(transactionId);

      if (!tx) {
        return res.status(404).json({ success: false, message: 'Transaction not found' });
      }

      return res.status(200).json({
        success: true,
        data: {
          receiptNumber: `REC-${tx.id.substring(0, 8).toUpperCase()}`,
          transactionId: tx.id,
          date: tx.transactionDate,
          forMonth: tx.forMonth,
          amount: tx.amount,
          paymentMethod: tx.paymentMethod,
          referenceId: tx.referenceId,
          status: tx.status,
          tenant: { id: tx.tenancy.tenant.id, name: tx.tenancy.tenant.name, phone: tx.tenancy.tenant.phone },
          landlord: {
            id: tx.tenancy.room.property.landlord.id,
            name: tx.tenancy.room.property.landlord.name,
            phone: tx.tenancy.room.property.landlord.phone,
            upiId: tx.tenancy.room.property.landlord.upiId
          },
          property: {
            title: tx.tenancy.room.property.title,
            address: tx.tenancy.room.property.address,
            roomNumber: tx.tenancy.room.roomNumber
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = transactionController;
