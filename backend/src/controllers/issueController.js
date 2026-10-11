const issueModel = require('../models/issueModel');
const tenancyModel = require('../models/tenancyModel');

const issueController = {
  getIssues: async (req, res, next) => {
    try {
      const issues = req.user.role === 'LANDLORD'
        ? await issueModel.findByLandlord(req.user.id)
        : await issueModel.findByTenant(req.user.id);

      return res.status(200).json({ success: true, data: issues });
    } catch (error) {
      next(error);
    }
  },

  reportIssue: async (req, res, next) => {
    try {
      const { title, description, category = 'OTHER' } = req.body;
      if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Title and description are required' });
      }

      const activeTenancy = await tenancyModel.findActiveByTenant(req.user.id);
      if (!activeTenancy) {
        return res.status(400).json({ success: false, message: 'No active lease found to report an issue for' });
      }

      const validCategories = ['ELECTRICAL', 'PLUMBING', 'CARPENTRY', 'OTHER'];
      const cat = validCategories.includes(String(category).toUpperCase()) ? String(category).toUpperCase() : 'OTHER';

      const issue = await issueModel.create({
        tenancyId: activeTenancy.id,
        title,
        description,
        category: cat,
        status: 'OPEN'
      });

      return res.status(201).json({ success: true, message: 'Issue reported', data: issue });
    } catch (error) {
      next(error);
    }
  },

  updateIssueStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

      if (!status || !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const issue = await issueModel.findById(req.params.id);
      if (!issue) {
        return res.status(404).json({ success: false, message: 'Issue not found' });
      }

      if (issue.tenancy.room.property.landlordId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied: Not your property' });
      }

      const resolvedAt = status.toUpperCase() === 'RESOLVED' ? new Date() : null;
      const updated = await issueModel.updateStatus(req.params.id, status.toUpperCase(), resolvedAt);

      return res.status(200).json({ success: true, message: 'Status updated', data: updated });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = issueController;
