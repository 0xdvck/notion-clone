import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useSelector } from "react-redux";
import { selectData, selectFields } from "../../redux/selectors/crm.selector";

export function Table() {
  const fields = useSelector(selectFields);
  const data = useSelector(selectData);
  const columns = useMemo(() => {
    return fields.map((field) => {
      return {
        header: field,
        accessorKey: field.toLocaleLowerCase(),
        cell: (info: { getValue: () => unknown }) => info.getValue(),
      };
    });
  }, [fields]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });
  const columnBeingDragged = useRef(0);

  const onDragStart = (e): void => {
    columnBeingDragged.current = Number(e.currentTarget.dataset.columnIndex);
  };

  const onDrop = (e): void => {
    e.preventDefault();
    const newPosition = Number(e.currentTarget.dataset.columnIndex);
    const currentCols = table.getVisibleLeafColumns().map((c) => c.id);
    const colToBeMoved = currentCols.splice(columnBeingDragged.current, 1);

    currentCols.splice(newPosition, 0, colToBeMoved[0]);
    table.setColumnOrder(currentCols); // <------------------------here you save the column ordering state
  };

  return (
    <>
      <div className="p-2 ">
        <table className="border rounded-lg w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                    draggable={
                      !table.getState().columnSizingInfo.isResizingColumn
                    }
                    data-column-index={header.index}
                    onDragStart={onDragStart}
                    onDragOver={(e): void => {
                      e.preventDefault();
                    }}
                    onDrop={onDrop}
                    className="relative border-r"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer  ${
                          table.options.columnResizeDirection
                        } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                        style: {
                          transform: "",
                        },
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="border min-w-32" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
