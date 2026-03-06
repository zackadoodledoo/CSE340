import { body, validationResult } from 'express-validator';
import { createContactForm, getAllContactForms } from '../../models/forms/contact.js';
import { Router } from 'express';

const router = Router();

/**
 * Display the contact form page.
 */
const showContactForm = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Handle contact form submission with validation.
 * If validation passes, save to database and redirect.
 * If validation fails, log errors and redirect back to form.
 */
export const handleContactSubmission = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        
        // Log validation errors for developer debugging
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        // Redirect back to contact form with error messages
        return res.redirect('/contact');
    }

    // Extract validated data
    const { subject, message } = req.body;

    try {
    const { subject, message } = req.body;

    // Persist the contact form submission
    await createContactForm(subject, message);

    // Success flash and redirect to /contact so non-auth users can see it
    req.flash('success', 'Thank you for contacting us! We will respond soon.');
    return res.redirect('/contact');
  } catch (error) {
    // Keep server-side logging for debugging
    console.error('Error saving contact form:', error);

    // Friendly user-facing flash
    req.flash('error', 'Unable to submit your message. Please try again later.');
    return res.redirect('/contact');
  }
};



/**
 * Display all contact form submissions.
 */
const showContactResponses = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();
    } catch (error) {
        console.error('Error retrieving contact forms:', error);
    }

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms
    });
};

/**
 * GET /contact - Display the contact form
 */
router.get('/', showContactForm);

/**
 * POST /contact - Handle contact form submission with validation
 */
router.post('/',
    [
        body('subject')
            .trim()
            .isLength({ min: 2, max: 255 })
            .withMessage('Subject must be between 2 and 255 characters')
            .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
            .withMessage('Subject contains invalid characters'),
        body('message')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Message must be between 10 and 2000 characters')
            .custom((value) => {
                // Check for spam patterns (excessive repetition)
                const words = value.split(/\s+/);
                const uniqueWords = new Set(words);
                if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
                    throw new Error('Message appears to be spam');
                }
                return true;
            })
    ],
    handleContactSubmission
);
/**
 * GET /contact/responses - Display all contact form submissions
 */
router.get('/responses', showContactResponses);

export default router;