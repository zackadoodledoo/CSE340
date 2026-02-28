import { getFacultyBySlug, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = async (req, res) => {
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';
    const facultyList = await getSortedFaculty(sortBy);

    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,
        currentSort: sortBy
    });
};

const facultyDetailPage = async (req, res, next) => {
    const slug = req.params.slug;  // this is correct

    const facultyMember = await getFacultyBySlug(slug);  // FIXED

    if (!facultyMember || Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${slug} not found`);  // FIXED
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: `${facultyMember.name} - Faculty Profile`,
        faculty: facultyMember
    });
};


export { facultyListPage, facultyDetailPage };