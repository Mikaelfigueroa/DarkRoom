import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import React from 'react';
import { MyContext } from "./myProvider"


export default class FollowButton extends React.Component {
    static contextType = MyContext;

    constructor(props) {
        super(props)
        this.state = {
            redirect: null,
            following: false,
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick(event) {
        let value = this.context;
        if (!value.state.user.username) {
            this.setState({ redirect: "/login" })
        }
        else {
            if (this.state.following) {
                this.setState({ following: false })
                var value2 = value.state
                var index = value2.user.following.indexOf(value2.user.following.find(x => x == this.props.user._id))
                value2.user.following.splice(index, 1)
                value.setUser(value2.user)
            }
            else {
                this.setState({ following: true })
                var value2 = value.state
                value2.user.following.push(this.props.user._id)
                value.setUser(value2.user)
            }

            axios({
                method: "GET",
                url: "/follow/" + this.props.user._id
            }).then(res => {
                this.props.parentCallback(res.data)
            })
        }
    }

    componentDidMount() {
        let value = this.context
        let user = this.props.user
        if (user.followers.find(e => e._id == value.state.user._id)) {
            this.setState({ following: true })
        }
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }



        return (
            <button className="interact-item" onClick={this.handleClick}>
                {
                    this.state.following == false ?

                        <p>Follow</p>
                        :
                        <span><i class="fas fa-user"></i><i class="fas fa-check"></i></span>
                }
            </button >
        )
    }
}



