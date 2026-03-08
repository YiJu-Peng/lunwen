/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.User } | undefined) {
  const  currentUser  = initialState?.currentUser ?? {};
  return {
    canAdmin: currentUser && currentUser.userRole === 'admin',
    canTeacher: currentUser && currentUser.userRole === 'teacher',
    canStudent: currentUser && currentUser.userRole === 'student',
  };
}
