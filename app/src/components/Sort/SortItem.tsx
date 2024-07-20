import { AiFillCloseCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSort, updateSort } from "../../redux/actions/crm.action";
import { selectFields } from "../../redux/selectors/crm.selector";

export function SortItem(props: any) {
  const id = props.id;
  const dispatch = useDispatch();
  const fields = useSelector(selectFields);

  const [selectedField, setSelectedField] = useState("");
  const [selectedDirection, setSelectedDirection] = useState("asc");

  useEffect(() => {
    if (selectedField && selectedDirection) {
      dispatch(
        updateSort(id, {
          property: selectedField,
          direction: selectedDirection,
        })
      );
    }

    return () => {
      if (selectedField && selectedDirection) {
        dispatch(deleteSort(id));
      }
    };
  }, [selectedField, selectedDirection, dispatch, id]);

  function onSelectFieldChange(e) {
    setSelectedField(e.target.value);
  }

  function onSelectDirectionChange(e) {
    setSelectedDirection(e.target.value);
  }

  return (
    <>
      <div className="flex  gap-2 mb-1">
        <form className="max-w-sm mx-auto text-xs">
          <select
            onChange={onSelectFieldChange}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>Choose a field</option>
            {fields.map((field: any) => {
              return (
                <option
                  key={`${field}`}
                  value={`${field.toLocaleLowerCase()}`}
                >{`${field}`}</option>
              );
            })}
          </select>
        </form>
        <form className="max-w-sm mx-auto text-xs">
          <select
            onChange={onSelectDirectionChange}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </form>
        <AiFillCloseCircle
          onClick={props.onDeleteClick}
          className="text-gray-700 text-xl self-center"
        />
      </div>
    </>
  );
}
