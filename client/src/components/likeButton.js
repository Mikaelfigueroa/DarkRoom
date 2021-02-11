import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import React, { Component } from 'react'
import { MyContext } from "./myProvider"


export default class LikeButton extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props)

        this.state = {
            redirect: null,
            liked: false
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(event) {
        let value = this.context;
        if (!value.state.user.username) {
            this.setState({ redirect: "/login" })
        }
        else {
            if (this.state.liked) {
                this.setState({ liked: false })
            }
            else {
                this.setState({ liked: true })
            }
            axios({
                method: "GET",
                url: "/like/" + this.props.post._id
            })
        }
    }

    componentDidMount() {
        let value = this.context
        let post = this.props.post
        if (post.likes.find(e => e._id == value.state.user._id)) {
            this.setState({ liked: true })
        }
    }
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="like-button">
                {this.state.liked == false ?

                    <button onClick={this.handleClick}><i class="far fa-heart"></i></button>
                    :
                    <button onClick={this.handleClick}><i class="fas fa-heart"></i></button>
                }
            </div>
        )
    }
}



