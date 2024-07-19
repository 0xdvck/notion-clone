import { configureStore } from "@reduxjs/toolkit";
import { CrmReducer } from "./reducers/crm.reducer";
// Use object literal shorthand syntax to define the object shape
// const rootReducer = combineReducers({ CrmReducer });

export const store = configureStore({
  reducer: CrmReducer,
});
