import React from 'react';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { MyContext } from "./myProvider"
import LikeButton from "./likeButton"


export default class LoadIndexPosts extends React.Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      redirect: null
    };

  }
  componentDidMount() {
    let value = this.context
    axios.get("/feed").then(res => {
      if (value.state.user.username && value.state.user.following.length == 0) {
        this.setState({ redirect: "/search" })
      }
      this.setState({ posts: res.data })
    })
  }

  render() {
    let value = this.context
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div id="load-index-post">
        {value.state.user.username == undefined && <h1 className="no-user">Global feed</h1>}

        {value.state.user.username && this.state.posts.length == 0 && <h1 className="no-user">Empty feed follow more users to get posts</h1>}
        
        
        {this.state.posts.map(post =>
          <div class="index-post">

            <Link to={{ pathname: "/profile/" + post.user._id }}>
              <span className="post-user-link">
                <img className="profile-image" src={post.user.image} alt="" />
                <p className="bolded">{post.user.username}</p>
              </span>
            </Link>


            <img className="post-image" src={post.image} />

            <span className="post-interact-span">
              <LikeButton post={post} />
              <Link to={{
                pathname: `/post/${post._id}`
              }}>
                <p className="bolded">Go to post</p>
              </Link>
            </span>

            <span className="bolded likes-count-span padd">
              <p className="likes-count">{post.likes.length}</p>
              <p>likes</p>
            </span>

            <span className="post-caption">



              <Link to={{ pathname: "/profile/" + post.user._id }}>
                <p className="bolded">{post.user.username}</p>
              </Link>
              <p className="caption">{post.caption.substr(0,30)+ "..."}</p>
            </span>






          </div>
        )}
      </div>
    )
  }
}