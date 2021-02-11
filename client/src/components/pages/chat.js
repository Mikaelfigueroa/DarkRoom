import React, { Component } from 'react'
import Axios from 'axios'
import {
    BrowserRouter as Router, Route, Link, Redirect, useHistory,
} from 'react-router-dom'
import { MyContext } from "../myProvider"
import socketIOClient from "socket.io-client";

export default class Chat extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props)

        this.state = {
            socketio: null,
            messages: [],
            redirect: null,
            user: {
                image: null,
                username: null
            },
        }
        this.handleData = this.handleData.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {


        let value = this.context
        const ENDPOINT = process.env.REACT_APP_SERVER_PORT;
        var socketio = socketIOClient(ENDPOINT)

        if (!value.state.user.username) {
            this.setState({ redirect: "/login" })
        }
        this.setState({ user: this.props.location.state.user })
        console.log(value.state.user._id)
        socketio.emit("chatjoin", { _id: value.state.user._id })
        socketio.on("newMessage", this.handleData)

        Axios({
            method: "POST",
            url: "/chat",
            data: {
                _id: this.props.location.state.user._id
            }
        }).then((res) => {
            console.log(res.data)
            this.setState({ messages: res.data })
        })

    }

    handleData = (message) => {


        var messages = this.state.messages
        messages.push(message)
        this.setState({ messages: messages })
    }

    componentDidUpdate(){
        var objDiv = document.querySelector(".messages-cont")
        if(objDiv){
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }



    handleSubmit = (event) => {
        var objDiv = document.querySelector(".messages-cont")
        objDiv.scrollTop = objDiv.scrollHeight;
        event.preventDefault()
        let value = this.context
        const ENDPOINT = process.env.REACT_APP_SERVER_PORT;
        var socketio = socketIOClient(ENDPOINT)
        var message = {
            text: document.getElementById("chat-input").value,
            senderUsername: value.state.user.username,
            senderId: value.state.user._id,
            receiverId: this.state.user._id
        }
        console.log(message)
        socketio.emit("message", message)
        var messages = this.state.messages
        messages.push({ text: document.getElementById("chat-input").value, username: value.state.user.username })
        this.setState({ messages: messages })
        event.target.reset()
    }


    render() {
        let value = this.context
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="chat">
                <div className="header">
                    <span>
                        <i class="fas fa-arrow-left" onClick={this.props.history.goBack} ></i>
                        <img className="profile-image" src={this.state.user.image} alt="" />
                        <p className="bolded">{this.state.user.username}</p>
                    </span>

                </div>

                <div className="messages-cont">

                    {this.state.messages.map((message) =>
                        <span className="message-cont">
                            {message.username == value.state.user.username ?
                                <span className="my-message">
                                    <p className="message">{message.text}</p>

                                </span>
                                :
                                <span className="their-message">
                                    <p className="message">{message.text}</p>
                                </span>
                            }


                        </span>
                    )}

                </div>


                <form onSubmit={this.handleSubmit}>
                    <input id="chat-input" type="text" placeholder="Message..." />

                </form>
            </div>
        )
    }
}
