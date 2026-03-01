import { Router } from "express";

import contactRoutes from './forms/contact.js';
import facultyRoutes from '../routes/faculty.js';
import registrationRoutes from './forms/registration.js';

// Middleware
import { addDemoHeaders } from "../middleware/demo/headers.js";

// Catalog controllers
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";

// Basic page controllers
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";

const router = Router();

/* ---------------- Router-Level Middleware ---------------- */

// Catalog CSS
router.use("/catalog", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

// Faculty CSS
router.use("/faculty", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

// Contact CSS
router.use('/contact', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

// Registration CSS  (MUST come before router.use('/register', registrationRoutes))
router.use('/register', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
  next();
});

/* ---------------- Mount Routers ---------------- */

router.use('/contact', contactRoutes);
router.use('/faculty', facultyRoutes);
router.use('/register', registrationRoutes);

/* ---------------- Basic Pages ---------------- */

router.get("/", homePage);
router.get("/about", aboutPage);

// Catalog
router.get("/catalog", catalogPage);
router.get("/catalog/:courseId", courseDetailPage);

// Demo + Error
router.get("/demo", addDemoHeaders, demoPage);
router.get("/test-error", testErrorPage);

export default router;