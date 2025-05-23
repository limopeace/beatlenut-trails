const Approval = require('./mongoose/approvalModel');

/**
 * Model for approval operations
 */
class ApprovalModel {
  /**
   * Create a new approval
   * @param {Object} approvalData - Approval data
   * @returns {Promise<Object>} Created approval
   */
  async create(approvalData) {
    const approval = new Approval(approvalData);
    await approval.save();
    return approval;
  }

  /**
   * Get approval by ID
   * @param {string} id - Approval ID
   * @returns {Promise<Object>} Approval document
   */
  async getById(id) {
    return await Approval.findById(id);
  }

  /**
   * Find approvals with query
   * @param {Object} query - MongoDB query
   * @param {Object} options - Query options (pagination, sort, etc.)
   * @returns {Promise<Array>} Found approvals
   */
  async find(query, options = {}) {
    return await Approval.find(query)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 10);
  }

  /**
   * Count approvals with query
   * @param {Object} query - MongoDB query
   * @returns {Promise<number>} Count of matching approvals
   */
  async count(query) {
    return await Approval.countDocuments(query);
  }

  /**
   * Update approval
   * @param {string} id - Approval ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated approval
   */
  async update(id, updateData) {
    return await Approval.findByIdAndUpdate(id, updateData, { new: true });
  }

  /**
   * Delete approval
   * @param {string} id - Approval ID
   * @returns {Promise<Object>} Deleted approval
   */
  async delete(id) {
    return await Approval.findByIdAndDelete(id);
  }
}

module.exports = new ApprovalModel();