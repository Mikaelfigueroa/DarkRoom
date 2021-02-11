import React from 'react';
import { MyContext } from "../myProvider"
import LoadIndexPosts from "../LoadIndexPosts"
import {
  BrowserRouter as Router, Route, Link, Redirect, useHistory,
} from 'react-router-dom'

export default class PostsIndex extends React.Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      redirect: null,
      posts: null
    };
  }

  
  render() {
    let value = this.context;
    return (
      <div className="postindex">
        <div className="header" id="postindexheader">
          <span id="logospan"><i class="logo-icon fas fa-camera-retro"></i><p id="logo-text">Darkroom</p></span>
         
            {value.state.user.username ? 
            <Link to="/conversations">
              <i class="fas fa-paper-plane"></i>
          </Link>
          :
          <Link to="/login">
            <i class="fas fa-paper-plane"></i>
          </Link>
          }

       


        </div>
        <LoadIndexPosts />
      </div>
    )
  }
}
