import express, { Router, Request, Response } from 'express';
import homepageData from '../../data/homepage.json';
import adminRoutes from "./admin";
import vendorRoutes from "./vendor";
import riderRoutes from "./rider";
import publicRoutes from "./public";
import customerRoutes from "./customer";
import reviewsRoute from "./reviews";
// import notificationRoutes from "./notifications";
import multer, { FileFilterCallback } from "multer";
import WaitlistService from "../../services/waitlist.service";
import CommonService from "../../services/common.service";
import path from 'path';
import UserService from '../../services/user.service';
import AuthMiddleware from '../../auth/jwt';

const router: Router = express.Router();


// Multer config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (
  _req: Request,
  _file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  cb(null, true); 
};

const upload = multer({ storage, fileFilter });

//waitlist route
router.post("/waitlist", WaitlistService.addToWaitlist);
router.get("/waitlist", WaitlistService.getWaitlist);
router.post("/verify-otp", UserService.verifyOtp);
router.get("/home", (req: Request, res: Response) => {
  res.generalResponse("Data fetched successfully", homepageData);
});

//admin routes
router.use("/public", publicRoutes);
router.use("/admin", adminRoutes);
router.use("/vendor", vendorRoutes);
router.use("/rider", riderRoutes);
router.use("/customer", customerRoutes);
router.use('/reviews', reviewsRoute)

// router.use("/notifications", notificationRoutes);

router.post("/resend-otp", UserService.resendOtp);
router.get("/me", AuthMiddleware.auth, UserService.getMe);
//uploads and downloads
// router.post('/uploads', ()=> console.log('Uploads disabled'));
router.post('/uploads', upload.any(), CommonService.uploadFiles);

router.get('/download', (req: Request, res: Response) => {
  const { filename } = req.query;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }
  const filePath = path.resolve(process.cwd(), 'uploads', filename);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});
//health check
router.get("/_health", (req, res) => {
  res.send("OK");
});

export default router;
