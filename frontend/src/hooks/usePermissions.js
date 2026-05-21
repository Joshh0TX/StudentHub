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

  const canModify = (createdById) => {
    if (isAdmin) return true;
    if (isStudent) return false;
    return String(createdById) === String(user?.id);
  };

  return { isAdmin, isCourseRep, isStudent, canCreate, canCreateIn, canModify };
};
