import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = (req, res) => {
    const sort = req.query.sort || "name";
    const faculty = getSortedFaculty(sort);

    res.render("faculty/list", {
        title: "Faculty Directory",
        faculty,
        currentSort: sort
    });
};

const facultyDetailPage = (req, res, next) => {
    const id = req.params.facultyId;
    const facultyMember = getFacultyById(id);

    if (!facultyMember) {
        const err = new Error("Faculty member not found");
        err.status = 404;
        return next(err);
    }

    res.render("faculty/detail", {
        title: facultyMember.name,
        faculty: facultyMember
    });
};

export { facultyListPage, facultyDetailPage };