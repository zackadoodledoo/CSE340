import pool from '../db.js';

// Return all faculty sorted by a field
export async function getSortedFaculty(sortBy = 'name') {
    const validSorts = ['name', 'department', 'title'];
    const sort = validSorts.includes(sortBy) ? sortBy : 'name';

    // Map sort options to real columns
    const sortColumn = {
        name: "last_name",          // sort by last name alphabetically
        department: "department_id",
        title: "title"
    }[sort];

    const query = `
        SELECT 
            first_name || ' ' || last_name AS name,
            slug,
            office,
            phone,
            email,
            department_id,
            title,
            gender
        FROM faculty
        ORDER BY ${sortColumn} ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
}

// Return a single faculty member by slug
export async function getFacultyBySlug(slug) {
    const query = `
        SELECT 
            first_name || ' ' || last_name AS name,
            slug,
            office,
            phone,
            email,
            department_id,
            title,
            gender
        FROM faculty
        WHERE slug = $1
        LIMIT 1;
    `;

    const result = await pool.query(query, [slug]);
    return result.rows[0] || {};
}
