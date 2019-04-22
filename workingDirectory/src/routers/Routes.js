import React from "react";
import { Route, Switch } from "react-router-dom";

import App from "../components/App.js";
import Signup from "../components/Signup.js";
import AppliedRoute from "./AppliedRoute.js"
// import Footer from "./containers/Footer";
import Login from "../components/Login.js";
import NotFound from "../components/NotFound.js";
// import Register from "./containers/Register";


// Pages needed
// Home page = app.js
// login page
// register page
// not found page





export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={App} props={childProps} />


    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;


// export default () =>
//   <Switch>
//     <Route path="/" exact component={Home} />
//     <Route path="/" exact component={Footer} />
//     <Route path="/login" exact component={Login} />
//     <Route path="/register" exact component={Register} />
//     <Route component={NotFound} />
    
//   </Switch>;