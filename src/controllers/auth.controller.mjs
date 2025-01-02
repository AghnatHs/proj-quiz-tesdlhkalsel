import AuthService from "../services/auth.service.mjs";

const AuthController = {
  loginAdmin: async (req, res, next) => {
    try {
      const result = await AuthService.loginAdmin(req, res);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const result = await AuthService.loginUser(req, res);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      const result = await AuthService.logout(req, res);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const result = await AuthService.refresh(req, res);
      return res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
