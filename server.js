// Imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import facultyRoutes from './src/routes/faculty.js';
import { setupDatabase, testConnection } from './src/models/setup.js';

// Environment + Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Global Template Variables
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase();
    res.locals.currentYear = new Date().getFullYear();
    next();
});

// Greeting Middleware 
app.use((req, res, next) => {
    const hour = new Date().getHours();
    res.locals.greeting =
        hour < 12 ? "Good Morning" :
        hour < 17 ? "Good Afternoon" :
                    "Good Evening";
    next();
});

// Request Logging Middleware
app.use((req, res, next) => {
    if (!req.path.startsWith('/.')) {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});


// Random Theme Middleware
app.use((req, res, next) => {
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];
    next();
});

// Global middleware to share query parameters with templates
app.use((req, res, next) => {
    res.locals.queryParams = req.query || {};
    next();
});


// ------------------------------
// Demo Page (Route-Specific Middleware)
// ------------------------------

// Route-specific middleware that sets custom headers
const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'This route uses route-specific middleware');
    next();
};

// Demo page route with header middleware
app.get('/demo', addDemoHeaders, (req, res) => {
    res.render('demo', {
        title: 'Middleware Demo Page'
    });
});

// ------------------------------
// Faculty Routes
// ------------------------------
app.use('/faculty', facultyRoutes);

// ------------------------------
// Course Catalog Data
// ------------------------------
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

// ------------------------------
// Main Routes
// ------------------------------
app.get('/', (req, res) => {
    res.render('home', { title: 'Welcome Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Me' });
});

app.get('/products', (req, res) => {
    res.render('products', { title: 'Our Products' });
});

// Course Catalog List
app.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'Course Catalog',
        courses
    });
});

// Enhanced course detail route with sorting 
app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    const sortBy = req.query.sort || 'time';
    let sortedSections = [...course.sections];

    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
        default:
            break;
    }

    res.render('course-detail', {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
});

// Test 500 Error
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// ------------------------------
// WebSocket Dev Server
// ------------------------------
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');
    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// ------------------------------
// Error Handling
// ------------------------------
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent || res.finished) return next(err);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV,
        greeting: res.locals.greeting
    });
});

// ------------------------------
// Start Server
// ------------------------------
app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});