import AdminDashboardService from "../services/adminDashboard.service.mjs";

const AdminDashboardController = {
  getOrRefreshSessions: async (req, res, next) => {
    try {
      const results = await AdminDashboardService.getOrRefreshSessions(req);
      return res.status(200).json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  },
};

export default AdminDashboardController;
