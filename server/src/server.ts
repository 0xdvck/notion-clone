import { camelCase } from "lodash-es";
import { Client } from "@notionhq/client";
import "dotenv/config";

import http from "http";
import { title } from "process";

const host = "localhost";
const port = 8080;

interface SalesCRM {
  [index: string]: { value: string; type: NotionType };
  name: { value: string; type: NotionTitleType };
  company: { value: string; type: NotionRichTextType };
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

const NotionType: {
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

const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionSecret = process.env.NOTION_SECRET;

// Will provide an error to users who forget to create the .env file
// with their Notion data in it
if (!notionDatabaseId || !notionSecret) {
  throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Initializing the Notion client with your secret
const notion = new Client({
  auth: notionSecret,
});

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  switch (req.url) {
    case "/":
      // Query the database and wait for the result
      const query = await notion.databases.query({
        database_id: notionDatabaseId,
      });

      // We map over the complex shape of the results and return a nice clean array of
      // objects in the shape of our `ThingToLearn` interface

      const list: SalesCRM[] = query.results.map((row: any) => {
        // row represents a row in our database and the name of the column is the
        // way to reference the data in that column
        let keys = Object.keys(row.properties);
        let result = keys.reduce((result: SalesCRM, key: string): SalesCRM => {
          let property = row.properties[key];

          let data;
          let type = property.type;
          switch (type) {
            case NotionType.MULT_SELECT:
              data =
                property[type]?.map((select: { name: any }) => select.name) ||
                [];
              break;
            case NotionType.CHECKBOX:
              data = property[type];
              break;
            case NotionType.UNIQUE_ID:
              data = property[type]?.number;
              break;
            case NotionType.NUMBER:
              data = property[type];
              break;
            case NotionType.PEOPLE:
              data = property[type]?.[0]?.id;
              break;
            case NotionType.SELECT:
              data = property[type]?.name;
              break;
            default:
              data = property[type]?.[0]?.plain_text;
              break;
          }

          result[camelCase(key)] = { value: data, type };
          return result;
        }, {} as SalesCRM);

        return result;
      });

      let fields = new Set();
      query.results.forEach((row: any) => {
        let keys = Object.keys(row.properties);

        keys.forEach((key: string) => fields.add(key));
      });

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
      ); /* @dev First, read about security */
      res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
      res.setHeader("Access-Control-Max-Age", 2592000); // 30 days
      res.setHeader("Access-Control-Allow-Headers", "content-type");
      res.writeHead(200);
      res.end(JSON.stringify({ crms: list, fields: Array.from(fields) }));
      break;

    default:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
