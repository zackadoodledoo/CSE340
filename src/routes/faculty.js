import express from "express";
import { facultyListPage, facultyDetailPage } from "../controllers/faculty/faculty.js";

const router = express.Router();

router.get("/", facultyListPage);
router.get("/:facultyId", facultyDetailPage);

export default router;