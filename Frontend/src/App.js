import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import User from "./User/Pages/User";
//import NewPlaces from "./Place/Pages/NewPlaces";
//import UserPlaces from "./Place/Pages/UserPlaces";
// import UpdatePlaces from "./Place/Pages/UpdatePlaces";
import Auth from "./User/Pages/Auth";
import { AuthContext } from "./Shared/context/auth-context";

import MainNavigation from "./Shared/Components/Navgation/MainNavigation";

import { useAuth } from "./Shared/hooks/auth-hook";
import LoadingSpinner from "./Shared/Components/LoadingSpinner";

//By Lazy loding we split code means we only load component when it is required
const UserPlaces = React.lazy(() => import("./Place/Pages/UserPlaces"));
const UpdatePlaces = React.lazy(() => import("./Place/Pages/UpdatePlaces"));
const NewPlaces = React.lazy(() => import("./Place/Pages/NewPlaces"));

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (!token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <User />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <User />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlaces />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlaces />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token, //convert true
        token: token,
        login: login,
        logout: logout,
        userId: userId,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          {/* Suspense fo lazy load */}
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {" "}
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
