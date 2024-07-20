import { CRM } from "../constants";

type SortOrder = "asc" | "desc";

interface SortField {
  property: string;
  direction?: SortOrder;
}

interface SortElement<T> {
  value: T;
  index: number;
}

const sortByString = (a: string, b: string) => {
  const _a = a.toLocaleUpperCase();
  const _b = b.toLocaleUpperCase();

  let result = 0;
  if (_a > _b) result = 1;
  if (_a < _b) result = -1;

  return result;
};

const sortByMultiSelect = (a: string[], b: string[]) => {
  const _a = a.join("").toLocaleUpperCase();
  const _b = b.join("").toLocaleUpperCase();

  let result = 0;
  if (_a > _b) result = 1;
  if (_a < _b) result = -1;

  return result;
};

const sortByNumber = (a: number, b: number) => a - b;
const sortByDate = (a: string, b: string) => {
  const _a = Date.parse(a);
  const _b = Date.parse(b);

  let result = 0;
  if (_a > _b) result = 1;
  if (_a < _b) result = -1;

  return result;
};

const sortByBoolean = (a: boolean, b: boolean) => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const sortByMapper: {
  [index: string]: (a: any, b: any) => number;
} = {
  date: sortByDate,
  timestamp: sortByNumber,
  number: sortByNumber,
  rich_text: sortByString,
  title: sortByString,
  status: sortByString,
  select: sortByString,
  checkbox: sortByBoolean,
  multi_select: sortByMultiSelect,
  unique_id: sortByNumber,
};

function compareByFields<T extends CRM>(
  a: SortElement<T>,
  b: SortElement<T>,
  fields: SortField[]
) {
  let result = 0;

  for (let i = 0; i < fields.length; i++) {
    try {
      const { property, direction } = fields[i];
      const aType = a.value[property].type;
      const bType = b.value[property].type;
      const aValue = a.value[property].value;
      const bValue = b.value[property].value;
      //same property,different type something wrong
      if (aType != bType) continue;

      result = sortByMapper[aType](aValue, bValue);
      if (result) {
        result = direction === "desc" ? result * -1 : result;
        break;
      }
    } catch (_c) {
      /* empty */
    }
  }
  return result;
}

export function sortByOrder<T extends CRM>(array: T[], fields: SortField[]) {
  const _array = array
    .map((element, index) => {
      return { value: element, index: index };
    })
    .sort((a, b) => compareByFields(a, b, fields))
    .map((element) => element.value);

  return _array;
}
