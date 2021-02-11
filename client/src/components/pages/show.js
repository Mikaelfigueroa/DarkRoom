import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "../myProvider"
import DeletePost from "../deletePost"
import Comments from "../comments"
import LikeButton from "../likeButton"


class Show extends React.Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      error: "",
      redirect: null,
      post: {
        user: {
          _id: null,
          image: null,
          username: null
        },
        likes: []
      },
      file: null,
    };
    this.editPost = this.editPost.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.toggleCaptionEdit = this.toggleCaptionEdit.bind(this)
  }
  toggleDropdown = (params) => {
    document.getElementById("myDropdown").classList.toggle("show");
    console.log(document.getElementById("myDropdown").classList)
  }
  toggleCaptionEdit = (params) => {
    if(document.getElementById("myDropdown").classList[1]){
      this.toggleDropdown()
    }
    document.getElementById("editcaptioncont").classList.toggle("show")
    console.log(document.getElementById("editcaptioncont").classList)

  }


  editPost(event) {
    event.preventDefault();
    const regex = /(#+[a-zA-Z0-9(_)]{1,})/g;
    
    axios({
      method: "PUT",
      data: {
        caption: document.getElementById("caption").value,
        hashtags: document.getElementById("caption").value.match(regex)
      },
      url: "/post/" + this.state.post._id
    }).then(res => {
      document.querySelector(".caption").innerHTML = document.getElementById("caption").value
      this.toggleCaptionEdit()
    })
  }

  componentDidMount() {
    let value = this.context;
    axios.get("/post/" + this.props.match.params.postId).then(res => {
      this.setState({ post: res.data })
    })

  }
  render() {
    let value = this.context;
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <div>
        <div className="header">
          <span><i class="fas fa-arrow-left" onClick={this.props.history.goBack} ></i><p className="bolded">Posts</p></span>






        </div>
        <div>
          <div id="show-header">
            <Link to={{ pathname: "/profile/" + this.state.post.user._id }}>
              <span className="post-user-link">
                <img className="profile-image" src={this.state.post.user.image} alt="" />
                <p className="bolded username">{this.state.post.user.username}</p>
              </span>
            </Link>













            {value.state.user.username && value.state.user._id == this.state.post.user._id ?
              <div id="edit-container">

                <div id="editcaption">
                  <div id="editcaptioncont">
                    <i onClick={this.toggleCaptionEdit} className="fas fa-times" ></i>
                    <form onSubmit={this.editPost}>
                      <input id="caption" type="text" placeholder={this.state.post.caption} />
                    </form>
                  </div>

                </div>

                <div class="dropdown">
                  <button onClick={this.toggleDropdown} class="dropbtn">
                    <i class="fas fa-ellipsis-h">
                    </i>
                  </button>
                  <div id="myDropdown" class="dropdown-content">
                    <DeletePost post={this.state.post._id} />
                    <button onClick={this.toggleCaptionEdit}><i class="fas fa-edit"></i>Edit Caption</button>
                  </div>
                </div>

              </div>
              :
              null}


          </div>




          <img className="post-image" id="showimg" src={this.state.post.image} />
          {this.state.post.user._id &&
            <span className="show-like-span">
              <LikeButton post={this.state.post} />


              <span className="bolded likes-count-span">
                <p className="likes-count">{this.state.post.likes.length}</p>
                <p>likes</p>
              </span>

            </span>
          }
          <span className="post-caption">
            <Link to={{ pathname: "/profile/" + this.state.post.user._id }}>

              <p className="bolded">{this.state.post.user.username}</p>
            </Link>
            <p className="caption">{this.state.post.caption}</p>
          </span>
        </div>
        <Comments _id={this.props.match.params.postId} />
      </div>
    );
  }
}
export default Show
