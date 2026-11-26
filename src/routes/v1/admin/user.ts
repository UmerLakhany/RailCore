import express, { Router } from "express";
import UserService from "../../../services/user.service";
import OrderService from "../../../services/order.service";


const router: Router = express.Router();

router.post("/approve", UserService.userApproval)
router.post("/reject", UserService.userRejection)
router.get("/:id", UserService.getUserById)
router.delete("/:id", UserService.deleteUser)
router.put("/", UserService.updateUser)
router.get("/", UserService.getUser)
router.get("/completedOrders/:id", OrderService.getCompletedOrdersCount)
router.get("/ratings/vendor/:id", UserService.getVendorRatings)
router.get("/address/vendor/:id", UserService.getVendorAddress)

export default router;