import { useEffect } from "react";
import { Table } from "./components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { APP_API_URL } from "./constants";
import { addCrms, addFields } from "./redux/actions/crm.action";
import "./App.css";
import { selectFields } from "./redux/selectors/crm.selector";
import { SortPanel } from "./components/Sort/SortPanel";

function App() {
  const dispatch = useDispatch();
  const fields = useSelector(selectFields);

  useEffect(() => {
    const controller = new AbortController();
    // pass controller as signal to fetch
    fetch(APP_API_URL, { signal: controller.signal })
      .then((r) => r.json())
      .then((r) => {
        dispatch(addFields(r.fields));
        dispatch(addCrms(r.crms));
      });

    return () => {
      // abort the request here
      controller.abort();
    };
    //dispatch stable so we can ignore this
  }, [dispatch]);

  return fields.length > 0 ? (
    <main>
      <div className="flex w-full">
        <SortPanel className="flex-1"></SortPanel>
        <div className="w-4/6"></div>
      </div>
      <Table></Table>
    </main>
  ) : null;
}

export default App;
