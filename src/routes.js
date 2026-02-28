import express from "express";
import { facultyListPage} from "./controllers/faculty/faculty.js";
import { catalogPage, courseDetailPage } from "./controllers/catalog/catalog.js";

const router = express.Router();

router.get("/faculty", facultyListPage);

/* CATALOG ROUTES */
router.get("/catalog", catalogPage);
router.get("/catalog/:id", courseDetailPage);

export default router;