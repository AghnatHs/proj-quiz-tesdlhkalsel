import db from "./connection.mjs";

const AdminDashboardQuery = {
  getSessionsReport: async function () {
    const [results] = await db.query(`SELECT * FROM sessions`);
    return results;
  },
};

export default AdminDashboardQuery;
