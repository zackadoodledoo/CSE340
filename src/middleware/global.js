// Dynamic asset system (from the assignment)
const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    res.locals.renderStyles = () => {
        return res.locals.styles
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };
};

// Main global middleware
const addLocalVariables = (req, res, next) => {
    setHeadAssetsFunctionality(res);

    const hour = new Date().getHours();

    res.locals.NODE_ENV = process.env.NODE_ENV || "production";
    res.locals.currentYear = new Date().getFullYear();
    res.locals.greeting =
        hour < 12 ? "Good Morning" :
        hour < 17 ? "Good Afternoon" :
                    "Good Evening";

    const themes = ["blue-theme", "green-theme", "red-theme"];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

    res.locals.queryParams = req.query || {};
    // Authentication UI state
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    next();
};

export { addLocalVariables };