import { useRef, useState } from "react";
import { SortItem } from "./SortItem";

export function SortPanel(props: any) {
  const lastId = useRef(0);
  const [sortItemIds, setSortItemIds] = useState([0]);

  function onAddSortClick(e) {
    lastId.current += 1;
    setSortItemIds([...sortItemIds, lastId.current]);
  }

  function onDeleteClick(id) {
    const newSortItemIds = sortItemIds.filter((item) => item !== id);

    setSortItemIds(newSortItemIds);
  }

  return (
    <>
      <div className="p-2 rounded w-80 translate-x-0 bg-neutral-400">
        <div>
          <div>
            {sortItemIds.map((id) => (
              <SortItem
                onDeleteClick={() => onDeleteClick(id)}
                key={id}
                id={id}
              ></SortItem>
            ))}
          </div>

          <button onClick={onAddSortClick} className="mt-5 w-full">
            {" "}
            Add Sort
          </button>
        </div>
      </div>
    </>
  );
}
