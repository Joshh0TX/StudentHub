// Check if user can create (admin or course_rep only)
const canCreate = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin") return next(); // ← admins always pass
  if (role === "student")
    return res.status(403).json({ error: "Students cannot create content." });
  next();
};

// Check if course rep is within their own department and year
const scopedToOwn = (req, res, next) => {
  const { role, courseRepOf } = req.user;
  if (role === "admin") return next();

  if (role === "course_rep") {
    const bodyDept = req.body.department;
    const bodyYear = Number(req.body.year);

    if (
      !courseRepOf ||
      courseRepOf.department !== bodyDept ||
      courseRepOf.level !== bodyYear
    ) {
      return res.status(403).json({
        error: "Course reps can only create within their own department and year.",
      });
    }
    return next();
  }

  res.status(403).json({ error: "Forbidden" });
};

module.exports = { canCreate, scopedToOwn };