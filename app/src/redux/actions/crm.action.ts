import {
  ADD_CRMS,
  ADD_FIELDS,
  ADD_SORT,
  CRM,
  DELETE_SORT,
  UPDATE_SORT,
} from "../../constants";

export const addCrms = (crms: CRM[]) => ({
  type: ADD_CRMS,
  crms,
});

export const addFields = (fields: string[]) => ({
  type: ADD_FIELDS,
  fields,
});

export const addSort = (id: any, condition) => ({
  type: ADD_SORT,
  id,
  condition,
});

export const deleteSort = (id: any) => ({
  type: DELETE_SORT,
  id,
});

export const updateSort = (id: any, condition) => ({
  type: UPDATE_SORT,
  id,
  condition,
});
