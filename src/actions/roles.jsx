import {  ROLES } from "./type";

export const setUsers = (totalRoles) => ({
  type: ROLES,
  payload: totalRoles,
});

// export const clearMessage = () => ({
//   type: CLEAR_MESSAGE,
// });