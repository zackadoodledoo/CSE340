import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

import contactRoutes from './forms/contact.js';
import registrationRoutes from './forms/registration.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

import { addDemoHeaders } from "../middleware/demo/headers.js";

import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";

import { Router } from 'express';

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

// Add login-specific styles to all login routes (must come before mounting loginRoutes)
router.use('/login', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/login.css">');
  next();
});

/* ---------------- Mount Routers ---------------- */

router.use('/contact', contactRoutes);
router.use('/register', registrationRoutes);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

/* ---------------- Basic Pages ---------------- */

router.get("/", homePage);
router.get("/about", aboutPage);

// Catalog
router.get("/catalog", catalogPage);
router.get("/catalog/:courseId", courseDetailPage);

// Faculty list and detail pages (use controller functions directly)
router.get('/faculty', facultyListPage);
router.get('/faculty/:slug', facultyDetailPage);


// Demo + Error
router.get("/demo", addDemoHeaders, demoPage);
router.get("/test-error", testErrorPage);

export default router;
