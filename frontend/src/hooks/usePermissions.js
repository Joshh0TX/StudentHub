import { useAuth } from "../context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role;

  const isAdmin = role === "admin";
  const isCourseRep = role === "course_rep";
  const isStudent = role === "student";

  const canCreate = isAdmin || isCourseRep;

  const canCreateIn = (department, year) => {
    if (isAdmin) return true;
    if (isCourseRep)
      return (
        user.department === department && Number(user.year) === Number(year)
      );
    return false;
  };

  // NEW: scope-aware modify check
  const canModifyIn = (createdById, department, year) => {
    if (isAdmin) return true;
    if (isStudent) return false;
    if (isCourseRep) {
      // Can modify anything within their own department + year
      const inScope =
        user.department === department && Number(user.year) === Number(year);
      if (inScope) return true;
      // Outside their scope, only their own content
      return String(createdById) === String(user?.id);
    }
    return false;
  };

  // Keep canModify for backwards compatibility (ownership-only fallback)
  const canModify = (createdById) => {
    if (isAdmin) return true;
    if (isStudent) return false;
    if (isCourseRep) return true; // Course reps can modify within their scope;
    return false;
  };

  return {
    isAdmin,
    isCourseRep,
    isStudent,
    canCreate,
    canCreateIn,
    canModify,
    canModifyIn,
  };
};
