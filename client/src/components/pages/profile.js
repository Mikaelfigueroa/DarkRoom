import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, useLocation} from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "../myProvider"
import Logout from "../logout"
import LoadPosts from "../loadPosts"
import FollowButton from "../followButton"

class Profile extends React.Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      redirect: null,
      user: {
        username: null,
        _id: null,
        followers: [],
        following: [],
        caption: null,
      },
      posts: []
    };
    this.callBack = this.callBack.bind(this);
    this.toggleLogout = this.toggleLogout.bind(this)
  }


  toggleLogout = (params) => {
    document.getElementById("logout").classList.toggle("show")
  }

  callBack(data) {
    console.log(data)
    this.setState({ user: data })
  }


  componentDidMount() {
    let value = this.context
    axios.get('/user/' + this.props.props.match.params.userId)
      .then(res => {
        this.setState({ user: res.data })
        axios.get("/post/user/" + this.props.props.match.params.userId).then(res => {
          this.setState({ posts: res.data })
        })
      }
      )
  }



  render() {

    let value = this.context;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      
      <div>

        <div className="header">
          <span id="profilespan">
            {value.state.user._id == this.state.user._id ?
              null :
              <i onClick={this.props.props.history.goBack} class="fas fa-arrow-left"></i>
            }
            <p>{this.state.user.username}</p>
          </span>
          <button className="bars-button" onClick={this.toggleLogout}><i class="fas fa-bars"></i></button>
        </div>

        <div className="profile-container">
          
          {this.state.user &&
            <div className="userinfo">
              <div id="useravatarcont">

                <img id="useravatar" src={this.state.user.image} />

              </div>
              <div id="countcont">


                <div id="postscount" className="count">
                  <p>{this.state.posts.length}</p>
                  <p>Posts</p>
                </div>
                <div id="followerscount" className="count">
                  <p>{this.state.user.followers.length}</p>
                  <p>Followers</p>
                </div>

                <div id="followingcount" className="count">
                  <p>{this.state.user.following.length}</p>
                  <p>Following</p>
                </div>
              </div>
              {this.state.user.caption && <div><p id="usercaption">{this.state.user.caption}</p></div>}

            </div>

          }



          {value.state.user._id == this.state.user._id ?
            <Link to={"/profile/edit"}>
              <button className="edit-profile-button">Edit Profile</button>
            </Link>
            :
            this.state.user._id ?


              <div className="interact-profile">
                <Link className="interact-item" to={{
                  pathname: "/chat",
                  state: {
                    user: this.state.user
                  }
                }}>
                  Message
                </Link>

                {value.state.checked &&
                  <FollowButton user={this.state.user} parentCallback={this.callBack} />
                }
              </div>
              : null
          }

          {value.state.user.username &&

            <div id="logout">
              <button onClick={this.toggleLogout} className="logout-cross"><i class="fas fa-times"></i></button>
              <Logout />
            </div>

          }

          <div id="profileimgcont">
            <LoadPosts posts={this.state.posts} />
          </div>
        </div>





      </div>
    );
    
  }
}
export default Profile
