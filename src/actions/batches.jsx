import {  BATCHES } from "./type";

export const setBatches = (totalBatches) => ({
  type: BATCHES,
  payload: totalBatches,
});

// export const clearMessage = () => ({
//   type: CLEAR_MESSAGE,
// });