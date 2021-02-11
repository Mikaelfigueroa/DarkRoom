import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import { MyContext } from "./myProvider"
import axios from 'axios';


export default class Comments extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props)
        this.state = {
            comments: []
        }
        this.handleComment = this.handleComment.bind(this)
        this.handleReply = this.handleReply.bind(this)
        this.replyToggle = this.replyToggle.bind(this)
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: "/post/comment/" + this.props._id
        }).then(res => {
            this.setState({ comments: res.data.reverse() })
        })
    }

    handleComment(event) {
        let value = this.context
        event.preventDefault()
        var text = event.target.children[0].value

        axios({
            method: "POST",
            url: "/post/comment/" + this.props._id,
            data: {
                text: text,
                post: this.props._id
            }
        }).then(res => {
            var a = this.state.comments
            res.data.user = value.state.user
            a.push(res.data)
            this.setState({ comments: a.reverse() })
        })
        event.target.reset()
    }

    handleReply(event) {
        event.preventDefault()
        var _id = event.target.id
        var commentId = event.target.parentElement.parentElement.id
        axios({
            method: "POST",
            url: "/post/reply/" + event.target.id,
            data: {
                text: event.target.children[0].value
            }
        }).then(res => {
            var a = this.state.comments
            var foundindex = a.indexOf(a.find(x => x._id == _id))
            a[foundindex] = res.data
            this.replyToggle(commentId)
            this.setState({ comments: a })
        })
    }

    replyToggle(value) {
        document.getElementById(value).children[1].classList.toggle("hidden")
        document.getElementById(value).children[0].children[1].children[1].classList.toggle("hidden")
    }

    render() {
        let value = this.context;
        return (

            <div className="commentwrapper">

                {value.state.user.username &&

                    <div className="comment own-comment">
                        <div className="commentavatar">
                            <Link to={{ pathname: "/profile/" + value.state.user._id }}>
                                <img className="profile-image" src={value.state.user.image} />
                            </Link>
                        </div>
                        <form className="newcommentform" onSubmit={this.handleComment}>
                            <input className="commentinput" type="text" name="text" placeholder="Leave a comment..." />
                        </form>
                    </div>
                }








                {this.state.comments.map((comment, index) =>

                    <div className="comment-container" id={"comment-" + index}>



                        <div className="comment">
                            <img className="profile-image" src={comment.user.image} alt="" />
                            <div className="comment-text-wrapper-wrapper">
                                <div className="comment-text-wrapper">
                                    <Link to={{ pathname: "/profile/" + comment.user._id }}>
                                        <p className="username bolded">{comment.user.username}</p>
                                    </Link>
                                    <p className="commenttext">{comment.text}</p>
                                </div>



                                {value.state.user.username && <p className="reply-button" onClick={(e) => this.replyToggle("comment-" + index, e)} >Reply</p>}

                            </div>
                        </div>




                        <div className="reply hidden">
                            <div>
                                <i class="fas fa-times-circle" onClick={(e) => this.replyToggle("comment-" + index, e)}></i>
                            </div>

                            <form id={comment._id} className="replycommentinput" onSubmit={this.handleReply}>
                                <input className="commentinput" type="text" name="reply" placeholder="Write a reply..." />
                            </form>
                        </div>




                        <div className="replies">
                            {comment.replies.map(reply =>

                                <div className="comment">
                                    <img className="profile-image" src={reply.user.image} alt="" />
                                    <div className="comment-text-wrapper-wrapper">
                                        <div className="comment-text-wrapper">
                                            <Link to={{ pathname: "/profile/" + reply.user._id }}>
                                                <p className="username bolded">{reply.user.username}</p>
                                            </Link>
                                            <p className="commenttext">{reply.text} </p>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>



                    </div>













                )}











            </div>
        )
    }
}
