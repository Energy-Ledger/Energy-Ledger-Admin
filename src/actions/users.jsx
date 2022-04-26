import {  USERS } from "./type";

export const setUsers = (totalUsers) => ({
  type: USERS,
  payload: totalUsers,
});

// export const clearMessage = () => ({
//   type: CLEAR_MESSAGE,
// });