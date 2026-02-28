import { Router } from "express";

// Middleware
import { addDemoHeaders } from "../middleware/demo/headers.js";

// Catalog controllers
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";

// Basic page controllers
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";

const router = Router();

// Add catalog-specific styles to all catalog routes
router.use("/catalog", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

// Add faculty-specific styles to all faculty routes
router.use("/faculty", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

//Routes

// Home and basic pages
router.get("/", homePage);
router.get("/about", aboutPage);

// Course catalog routes
router.get("/catalog", catalogPage);
router.get("/catalog/:courseId", courseDetailPage);



// Demo page with special middleware
router.get("/demo", addDemoHeaders, demoPage);

// Route to trigger a test error
router.get("/test-error", testErrorPage);

export default router;