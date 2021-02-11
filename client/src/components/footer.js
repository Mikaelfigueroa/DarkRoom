import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { MyContext } from "./myProvider"

export default class Footer extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    return (
      <div className="Footer">
        <Link to="/post/index">
          <i class="fas fa-home"></i>
        </Link>

        <Link to="/search">
          <i class="fas fa-search"></i>
        </Link>

        <Link to="/post/new">
          <i class="fas fa-plus"></i>
        </Link>

        <Link to="/activity">
          <i class="fas fa-heart"></i>
        </Link>

        {value.state.user.username == null ?
          <Link to="/login">
            <span><i class="fas fa-user"></i><p id="loginlink">Login</p></span>
          </Link>
          :
          <Link to={{ pathname: "/profile/" + value.state.user._id, key: "profile",state:{trigtext: Math.random()} }}>
            <img id="profileicon" src={value.state.user.image} />
          </Link>
        }
      </div>
    )
  }
}