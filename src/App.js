import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

// import all pages
import HomePage from "./pages/HomePage/HomePage";
import EditablePage from "./pages/EditablePage/EditablePage";
import LandingPage from "./pages/LandingPage/LandingPage";
import TagSearchPage from "./pages/TagSearchPage/TagSearchPage";
import PostPage from "./pages/YourPostPage/YourPostPage";
import LikedPage from "./pages/LikedPostPage/LikedPostPage";
import AdminTagPage from "./pages/AdminTagPage/AdminTagPage";
import AdminPage from "./pages/AdminPage/AdminPage";

export default function App() {
  return (
    <Router>
      <div>
      </div>
        <Switch>
          <Route path="/draft">
            <EditablePage/>
          </Route>
          <Route path="/home">
            <HomePage/>
          </Route>
          <Route path="/yourpost">
            <PostPage/>
          </Route>
          <Route path="/likedpost">
            <LikedPage/>
          </Route>
          <Route path="/search/:tag">
            <TagSearchPage/>
          </Route>
          <Route path="/admin/tags">
            <AdminTagPage/>
          </Route>
          <Route path="/admin/page">
            <AdminPage/>
          </Route>
          <Route path="/">
            <LandingPage/>
          </Route>
        </Switch>
    </Router>
  );
}
