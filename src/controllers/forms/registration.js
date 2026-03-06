import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';

const router = Router();

/* ---------------- Validation Rules ---------------- */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\-]+$/)
        .withMessage('Name can only contain letters, spaces, apostrophes, and hyphens'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email is too long. Email must be less than 255 characters'),

    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be between 8 and 128 characters')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
        .withMessage('Password must contain at least one special character'),

    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/* ---------------- Controllers ---------------- */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/register');
    }
    try {
        const { name, email, password } = req.body;

        // Check for duplicate emails
        const exists = await emailExists(email);
        if (exists) {
            req.flash('warning', 'Email is already registered. Please use a different email or log in.');
            return res.redirect('/register');
        }
        // Hash pa$$word and create user
        const hashedPassword = await bcrypt.hash(password, 10);

        await saveUser(name, email, hashedPassword);

        // Success flash and redirect to /login so non-auth users can see it
        req.flash('success', 'Registration complete. You can now log in.');
        return res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error', 'Unable to complete registration. Please try again later.');
        return res.redirect('/register');
    }
};


const showAllUsers = async (req, res) => {
    let users = [];

    try {
        users = await getAllUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users',
        users
    });
};

/* ---------------- Routes ---------------- */
router.get('/', showRegistrationForm);
router.post('/', registrationValidation, processRegistration);
router.get('/list', showAllUsers);

export default router;