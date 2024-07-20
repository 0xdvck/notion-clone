import { createSelector } from "@reduxjs/toolkit";
import { sortByOrder } from "../../utils/sort";

export const selectSortQuery = (state) => state.sort.query;
export const selectFields = (state) => state.fields;
export const selectRawData = (state) => state.crms.byId;

export const selectData = createSelector(
  [selectRawData, selectSortQuery],
  (rawData, sortQuery) => {
    let data = Object.keys(rawData).map((key) => rawData[key]);

    if (sortQuery) data = sortByOrder(data, sortQuery);
    data = data.map((item) => {
      const keys = Object.keys(item);
      const newItem: { [index: string]: any } = {};

      keys.forEach((key) => {
        newItem[key] = item[key]?.value == null ? "" : item[key]?.value;
      });
      return newItem;
    });
    return data;
  }
);
