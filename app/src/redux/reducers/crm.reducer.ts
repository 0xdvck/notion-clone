import {
  ADD_CRMS,
  ADD_FIELDS,
  ADD_FILTER,
  ADD_SORT,
  CRM,
  CRMNormalizeData,
  DELETE_SORT,
  UPDATE_SORT,
} from "../../constants";
import { convertFilterDataToQuery } from "../../utils/filter";

function addCrms(state: any, action: any) {
  const fetchedCrms = action.crms;

  const crms: CRMNormalizeData = {
    byId: {},
    allIds: [],
  };

  fetchedCrms.forEach((crm: CRM) => {
    crms.allIds.push(+crm.id.value);
    crms.byId[crm.id.value] = crm;
  });

  return Object.assign({}, state, {
    crms: crms,
  });
}

function addFields(state: any, action: any) {
  const fetchedFields = action.fields;

  return Object.assign({}, state, {
    fields: fetchedFields,
  });
}

function addFilter(state: any, action: any) {
  const newFilter = {
    error: undefined,
    data: {
      ...state.filter.data,
      [action.id]: action.condition,
    },
    query: {},
  };

  newFilter.query = convertFilterDataToQuery(newFilter.data);
  return newFilter;
}

function addSort(state: any, action: any) {
  const newSort: { data: any; query: any } = {
    data: {
      ...state.sort.data,
      [action.id]: action.condition,
    },
    query: [],
  };

  newSort.query = Object.keys(newSort.data).map((key) => newSort.data[key]);

  return {
    ...state,
    sort: newSort,
  };
}

function updateSort(state: any, action: any) {
  const newSort: { data: any; query: any } = {
    data: {
      ...state.sort.data,
      [action.id]: action.condition,
    },
    query: [],
  };

  newSort.query = Object.keys(newSort.data).map((key) => newSort.data[key]);

  return {
    ...state,
    sort: newSort,
  };
}

function deleteSort(state, action) {
  const newSort: { data: any; query: any } = {
    data: {
      ...state.sort.data,
      [action.id]: undefined,
    },
    query: [],
  };

  newSort.query = Object.keys(newSort.data).map((key) => newSort.data[key]);

  return {
    ...state,
    sort: newSort,
  };
}

const initialState = {
  crms: {
    byId: {},
    allIds: [],
  },
  fields: [],
  sort: {
    
    data: {},
    query: [],
  },
  filter: {
    error: undefined,
    data: {
      0: {
        id: 0,
        children: [],
        condition: "",
        type: "group",
      },
    },
    query: {},
  },
};

export function CrmReducer(state = initialState, action: any) {
  switch (action.type) {
    case ADD_CRMS:
      return addCrms(state, action);
    case ADD_FIELDS:
      return addFields(state, action);
    case ADD_FILTER:
      return addFilter(state, action);
    case ADD_SORT:
      return addSort(state, action);
    case UPDATE_SORT:
      return updateSort(state, action);
    case DELETE_SORT:
      return deleteSort(state, action);
    default:
      return state;
  }
}
