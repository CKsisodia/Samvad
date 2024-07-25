import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          theme="dark"
          transition={Zoom}
        />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);
