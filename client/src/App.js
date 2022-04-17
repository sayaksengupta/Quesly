import "./App.css";
import axios from "axios";
import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import { useHistory } from "react-router-dom";
import Logout from "./Components/Logout";
import Registration from "./Components/Registration";
import Health from "./Components/Health";
import Business from "./Components/Business";
import Lifestyle from "./Components/Lifestyle";
import Education from "./Components/Education";
import Trending from "./Components/Trending";
import ErrorPage from "./Components/ErrorPage";
import Profile from "./Components/Profile";
import VisitingProfile from "./Components/VisitingProfile";
import Spaces from "./Components/Spaces";
import UserSpaces from "./Components/UserSpaces";
import Contact from "./Components/Contact";

function App() {
  const history = useHistory();

  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />

        <Route path="/register" component={Registration} />

        <Route path="/login" component={Login} />

        <Route path="/logout" component={Logout} />

        <Route path="/health" component={Health} />

        <Route path="/business" component={Business} />

        <Route path="/lifestyle" component={Lifestyle} />

        <Route path="/education" component={Education} />

        <Route path="/trending" component={Trending} />

        <Route path="/profile" component={Profile} />

        <Route path="/visiting-profile" component={VisitingProfile} />

        <Route path="/spaces" component={Spaces} />

        <Route path="/my-spaces" component={UserSpaces} />

        <Route path="/contact" component={Contact} />

        <Route path="*" component={ErrorPage} />

      </Switch>
    </>
  );
}

export default App;
