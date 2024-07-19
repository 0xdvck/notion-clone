import { NotionType } from "../constants";

const FilterOptions = {
  AFTER: "after",
  BEFORE: "before",
  NEXT_MONTH: "next_month",
  NEXT_WEEK: "next_week",
  NEXT_YEAR: "next_year",
  ON_OR_AFTER: "on_or_after",
  ON_OR_BEFORE: "on_or_before",
  PAST_MONTH: "past_month",
  PAST_WEEK: "past_week",
  PAST_YEAR: "past_year",
  THIS_WEEK: "this_week",
  CONTAINS: "contains",
  DOES_NOT_CONTAINS: "does_not_contains",
  IS_EMPTY: "is_empty",
  IS_NOT_EMPTY: "is_not_empty",
  EQUALS: "equals",
  LESS_THAN: "less_than",
  LESS_THAN_OR_EQUAL_TO: "less_than_or_equal_to",
  DOES_NOT_EQUAL: "does_not_equal",
  ENDS_WITH: "ends_with",
  STARTS_WITH: "starts_with",
  GREATER_THAN: "greater_than",
  GREATER_THAN_OR_EQUAL_TO: "greater_than_or_equal_to",
};

const NotOf = {
  contains: "does_not_contain",
  does_not_contain: "contains",
  is_empty: "is_not_empty",
  is_not_empty: "is_empty",
  does_not_equal: "equals",
};

const FilterFunctionByType: {
  [index: string]: any;
} = {
  [NotionType.NUMBER]: {
    [FilterOptions.GREATER_THAN]: (a, b) => a > b,
    [FilterOptions.DOES_NOT_EQUAL]: (a, b) => a != b,
    [FilterOptions.EQUALS]: (a, b) => a == b,
    [FilterOptions.GREATER_THAN_OR_EQUAL_TO]: (a, b) => a >= b,
    [FilterOptions.LESS_THAN]: (a, b) => a < b,
    [FilterOptions.LESS_THAN_OR_EQUAL_TO]: (a, b) => a <= b,
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && Boolean(a) === false,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && Boolean(a) === true,
  },
  [NotionType.CHECKBOX]: {
    [FilterOptions.DOES_NOT_EQUAL]: (a, b) => a != b,
    [FilterOptions.EQUALS]: (a, b) => a == b,
  },
  [NotionType.DATE]: {
    //TO-DO add support for other field
    [FilterOptions.BEFORE]: (a, b) => Date.parse(a) < Date.parse(b),
    [FilterOptions.AFTER]: (a, b) => Date.parse(a) > Date.parse(b),
    [FilterOptions.ON_OR_AFTER]: (a, b) => Date.parse(a) >= Date.parse(b),
    [FilterOptions.ON_OR_BEFORE]: (a, b) => Date.parse(a) <= Date.parse(b),
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && Boolean(a) === false,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && Boolean(a) === true,
  },
  [NotionType.TIMESTAMP]: {
    //TO-DO add support for other field
    [FilterOptions.BEFORE]: (a, b) => Date.parse(a) < Date.parse(b),
    [FilterOptions.AFTER]: (a, b) => Date.parse(a) > Date.parse(b),
    [FilterOptions.ON_OR_AFTER]: (a, b) => Date.parse(a) >= Date.parse(b),
    [FilterOptions.ON_OR_BEFORE]: (a, b) => Date.parse(a) <= Date.parse(b),
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && Boolean(a) === false,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && Boolean(a) === true,
  },
  [NotionType.MULT_SELECT]: {
    [FilterOptions.CONTAINS]: (a, b) => a.some((item) => item.includes(b)),
    [FilterOptions.DOES_NOT_CONTAINS]: (a, b) =>
      a.every((item) => !item.includes(b)),
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && a.length <= 0,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && a.length > 0,
  },
  [NotionType.RICH_TEXT]: {
    [FilterOptions.CONTAINS]: (a, b) => a.includes(b),
    [FilterOptions.DOES_NOT_CONTAINS]: (a, b) => !a.includes(b),
    [FilterOptions.DOES_NOT_EQUAL]: (a, b) => a !== b,
    [FilterOptions.EQUALS]: (a, b) => a === b,
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && a.length <= 0,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && a.length > 0,
    [FilterOptions.ENDS_WITH]: (a, b) => a.endsWith(b),
    [FilterOptions.STARTS_WITH]: (a, b) => a.startsWith(b),
  },
  [NotionType.SELECT]: {
    [FilterOptions.DOES_NOT_EQUAL]: (a, b) => a !== b,
    [FilterOptions.EQUALS]: (a, b) => a === b,
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && a.length <= 0,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && a.length > 0,
  },
  [NotionType.STATUS]: {
    [FilterOptions.DOES_NOT_EQUAL]: (a, b) => a !== b,
    [FilterOptions.EQUALS]: (a, b) => a === b,
    [FilterOptions.IS_EMPTY]: (a, b) => b === true && a.length <= 0,
    [FilterOptions.IS_NOT_EMPTY]: (a, b) => b === true && a.length > 0,
  },
};

function evaluateCondition(item, condition) {
  const { type, value } = item[condition.property || condition.timestamp];

  const field = Object.keys(condition).filter(
    (field) => field !== "property" && field !== "timestamp"
  )[0];

  if (FilterFunctionByType[type][field])
    return FilterFunctionByType[type][field](value, condition[field]);

  return false;
}

function applyFilter(item, filter) {
  if ("and" in filter) {
    return filter.and.every((subFilter) => applyFilter(item, subFilter));
  }
  if ("or" in filter) {
    return filter.or.some((subFilter) => applyFilter(item, subFilter));
  }
  return evaluateCondition(item, filter);
}

export function compoundFilter(items, filter) {
  return items.filter((item) => applyFilter(item, filter));
}

export function convertFilterDataToQuery(input) {
  function processNode(nodeId) {
    const node = input[nodeId];

    if (node.type === "simple") {
      return node.query || {};
    }

    if (node.type === "group") {
      let childFilters = node.children
        .map(processNode)
        .filter((filter) => Object.keys(filter).length > 0);

      if (childFilters.length === 0) {
        return {};
      }

      if (childFilters.length === 1) {
        childFilters = childFilters[0];
      } else {
        childFilters = { [node.condition]: childFilters };
      }
      return childFilters;
    }

    return {};
  }

  function processNotFilter(item) {
    if ("and" in item) {
      return { and: item.and.map((item) => processNotFilter(item)) };
    }
    if ("or" in item) {
      return { or: item.or.map((item) => processNotFilter(item)) };
    }
    if ("nor" in item) {
      item.or = item.nor.map((item) => {
        if (item["and"]) {
          return {
            nand: item["and"],
          };
        } else if (item["or"]) {
          return {
            nor: item["or"],
          };
        } else if (item["nand"]) {
          return {
            and: item["nand"],
          };
        } else if (item["nor"]) {
          return {
            or: item["nor"],
          };
        } else {
          const field = Object.keys(item).filter(
            (field) => field !== "property" && field !== "timestamp"
          )[0];
          return {
            ...item,
            [NotOf[field]]: item[field],
            [field]: undefined,
          };
        }
      });
      delete item.nor;
      return { or: item.or.map((item) => processNotFilter(item)) };
    }

    if ("nand" in item) {
      item.and = item.nand.map((item) => {
        if (item["and"]) {
          return {
            nand: item["and"],
          };
        } else if (item["or"]) {
          return {
            nor: item["or"],
          };
        } else if (item["nand"]) {
          return {
            and: item["nand"],
          };
        } else if (item["nor"]) {
          return {
            or: item["nor"],
          };
        } else {
          const field = Object.keys(item).filter(
            (field) => field !== "property" && field !== "timestamp"
          )[0];
          return {
            ...item,
            [NotOf[field]]: item[field],
            [field]: undefined,
          };
        }
      });

      delete item.nand;
      return { and: item.and.map((item) => processNotFilter(item)) };
    }

    return item;
  }

  let result = processNode(0);
  result = processNotFilter(result);

  return result;
}

// Example input:
// const input1 = {
//   0: {
//     id: 0,
//     children: [1, 4],
//     condition: "or",
//     type: "group",
//   },
//   1: {
//     id: 1,
//     children: [2, 3],
//     type: "group",
//     condition: "nand", //nand here
//   },
//   2: {
//     id: 2,
//     type: "simple",
//     query: {
//       property: "Tags",
//       contains: "A",
//     },
//   },
//   3: {
//     id: 3,
//     type: "group",
//     children: [5, 6],
//     condition: "or",
//   },
//   4: {
//     id: 4,
//     type: "simple",
//     query: {
//       property: "Tags",
//       contains: "B",
//     },
//   },
//   5: {
//     id: 5,
//     type: "simple",
//     query: {
//       property: "Tags",
//       contains: "D",
//     },
//   },
//   6: {
//     id: 6,
//     type: "simple",
//     query: {
//       property: "Tags",
//       contains: "C",
//     },
//   },
// };
// const output = {
//   "or": [
//     {
//       "and": [
//         {
//           "property": "Tags",
//           "does_not_contain": "A"
//         },
//         {
//           "or": [
//             {
//               "property": "Tags",
//               "does_not_contain": "D"
//             },
//             {
//               "property": "Tags",
//               "does_not_contain": "C"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "property": "Tags",
//       "contains": "B"
//     }
//   ]
// }
// convertFilterDataToQuery(input1)
