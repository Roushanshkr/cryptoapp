import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Correct import
import { Provider } from "react-redux";

import App from "./App";
import store from "./app/store";
// import 'antd/dist/antd.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 <Provider store={store}> {/* ✅ Provider should wrap everything */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>

);












// import React from "react";
// import ReactDOM from "react-dom/client"; 
// import { Router, BrowserRouter as router } from 'react-router-dom';
// import App from "./App";

// ReactDOM.render(
// <Router> 
//       <App />
//       </Router>,
//       document.getElementById("root")
// ); 