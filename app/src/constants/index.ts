//TO-DO move to env file
export const APP_API_URL = "http://localhost:8080";

export const ADD_CRMS = "ADD_CRMS";
export const ADD_FIELDS = "ADD_FIELDS";
export const ADD_FILTER = "ADD_FILTER";
export const ADD_SORT = "ADD_SORT";
export const UPDATE_SORT = "UPDATE_SORT";
export const DELETE_SORT = "DELETE_SORT";

export type CrmActionType = "ADD_CRM" | "ADD_FIELDS";

export interface CRM {
  [index: string]: { value: string | number; type: string };
  id: Omit<CRMType, "type"> & { type: NotionUniqueIdType };
  name: Omit<CRMType, "type"> & { type: NotionTitleType };
  company: Omit<CRMType, "type"> & { type: NotionRichTextType };
}

export interface CRMType {
  value: number | string;
  type: string;
}

export interface CRMNormalizeData {
  byId: {
    [index: string]: CRM;
  };
  allIds: number[];
}

type NotionTitleType = "title";
type NotionRichTextType = "rich_text";
type NotionDateType = "date";
type NotionUniqueIdType = "unique_id";
type NotionSelectType = "select";
type NotionMultiSelectType = "multi_select";

type NotionNumberType = "number";
type NotionPeopleType = "people";
type NotionCheckBoxType = "checkbox";
type NotionStatusType = "status";
type NotionTimeStampType = "timestamp";

type NotionType =
  | NotionTitleType
  | NotionRichTextType
  | NotionDateType
  | NotionUniqueIdType
  | NotionNumberType
  | NotionSelectType
  | NotionPeopleType
  | NotionMultiSelectType
  | NotionCheckBoxType
  | NotionTimeStampType
  | NotionStatusType;

export const NotionType: {
  [index: string]: NotionType;
} = {
  SELECT: "select",
  MULT_SELECT: "multi_select",
  NUMBER: "number",
  PEOPLE: "people",
  UNIQUE_ID: "unique_id",
  DATE: "date",
  TITLE: "title",
  RICH_TEXT: "rich_text",
  CHECKBOX: "checkbox",
  TIMESTAMP: "timestamp",
  status: "status",
};
