import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouteComponent from "./RouteComponent";

function App() {
  return (
    <>
      <RouteComponent />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
