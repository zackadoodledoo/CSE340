import db from "../db.js";

async function getSortedFaculty(sortBy = "department") {
  const validColumns = ["name", "department", "title"];
  const column = validColumns.includes(sortBy) ? sortBy : "department";

  const result = await db.query(
    `SELECT * FROM faculty ORDER BY ${column} ASC`
  );

  return result.rows;
}

async function getFacultyBySlug(slug) {
  const result = await db.query(
    `SELECT * FROM faculty WHERE slug = $1 LIMIT 1`,
    [slug]
  );

  return result.rows[0] || {};
}

export { getSortedFaculty, getFacultyBySlug };