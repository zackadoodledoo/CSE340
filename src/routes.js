import express from "express";
import { homePage } from './home.js';
import { aboutPage } from './about.js';

// Correct controller paths (this file is already inside controllers/)
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";

import registrationRoutes from './forms/registration.js';

const router = express.Router();

/* ---------------- Router-Level Middleware ---------------- */

// Add catalog-specific styles to all catalog routes
router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// Add faculty-specific styles to all faculty routes 
router.use('/faculty', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">'); 
    next();
});

/* ---------------- Route Definitions ---------------- */

router.get('/', homePage);
router.get('/about', aboutPage);

// Catalog
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// Faculty
router.get('/faculty', facultyListPage);
router.get('/faculty/:slug', facultyDetailPage);

export default router;
