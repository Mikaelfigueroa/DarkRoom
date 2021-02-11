import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import Footer from "./components/footer"
import PostsIndex from "./components/pages/postsIndex"
import Login from "./components/pages/login"
import Register from "./components/pages/register"
import TestLogin from "./components/testLogin"


import Profile from "./components/pages/profile"
import ProfileEdit from "./components/pages/profileEdit"
import PostNew from "./components/pages/postNew"
import Show from "./components/pages/show"
import Search from "./components/pages/search"
import Landing from "./components/pages/landing"

import MyProvider from "./components/myProvider"

import "./App.css"
import configs from "./configs"
import Chat from "./components/pages/chat"
import Conversations from "./components/pages/conversations"
import Activity from './components/pages/activity'
import Axios from "axios"

class App extends React.Component {


  render() {
    return (
      <MyProvider>
        <div className="App">
          <Router>
            <Switch>
              <Route path="/" exact component={PostsIndex} />
              <Route path="/post" exact component={PostsIndex} />
              <Route path="/conversations" exact component={Conversations} />
              <Route path="/chat" exact component={Chat} />
              <Route path="/post/index" exact component={PostsIndex} />
              <Route path="/post/new" exact component={PostNew} />
              <Route path="/post/:postId" component={Show} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/profile/edit" exact component={ProfileEdit} />
              <Route path="/profile/:userId" component={(props)=> <Profile props={props} keyProp={"profile"} key={Math.random()}/> } />
              <Route path="/search" exact component={Search} />
              <Route path="/activity" exact component={Activity} />
            </Switch>
            <Footer />
          </Router>
        </div>

      </MyProvider>
    )
  }
}
export default App;
