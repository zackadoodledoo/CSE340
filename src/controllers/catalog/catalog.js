// Import model functions
import { 
    getAllCourses, 
    getCourseById, 
    getSortedSections 
} from "../../models/catalog/catalog.js";

// List page controller
const catalogPage = (req, res) => {
    const courses = getAllCourses();

    res.render("catalog/list", {
        title: "Course Catalog",
        courses
    });
};

// Detail page controller
const courseDetailPage = (req, res, next) => {
    const courseId = req.params.courseId;   // MUST match /catalog/:courseId
    const course = getCourseById(courseId);

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    const sortBy = req.query.sort || "time";
    const sortedSections = getSortedSections(course.sections, sortBy);

    res.render("catalog/detail", {
        title: `${course.id} - ${course.title}`,
        course: { ...course, sections: sortedSections },
        currentSort: sortBy
    });
};

export { catalogPage, courseDetailPage };