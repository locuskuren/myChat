import { AuthUser } from '../graphql';

export const getCurrentUser = () => {
  const userObjString = localStorage.getItem('user');
  const user: AuthUser | null = userObjString
    ? JSON.parse(userObjString)
    : null;
  return user;
};
