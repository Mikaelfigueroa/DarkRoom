import React, { Component } from 'react'
import Axios from 'axios';
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom'
import { MyContext } from "../myProvider"


export default class Conversations extends Component {
    static contextType = MyContext
    constructor(props) {
        super(props)
        this.state = {
            conversations: []
        }
    }
    componentDidMount() {
        let value = this.context
        Axios({
            method: "GET",
            url: "/conversations"
        }).then((res) => {
            if (res.data.length != 0) {
                this.setState({ conversations: res.data })
            }
        })
    }
    render() {
        let value = this.context
        console.log(this.state.conversations)
        return (
            <div class="conversation-cont">
                <h1 className="text-center">Conversations</h1>
                <div>
                    {!this.state.conversations[0] &&
                        <p>Empty Inbox</p>
                    }
                    {this.state.conversations.map(x =>
                        <Link to={{pathname: "/chat", state: {user: x.users[x.users.indexOf(x.users.find(z => z.username!== value.state.user.username ) )] }}}>
                            <div className="conversation"> 
                                <img className="profile-image" src={x.users[x.users.indexOf(x.users.find(z => z.username!== value.state.user.username ) )].image  } alt="" />
                                <div>
                                    <p className="bolded">{x.users[x.users.indexOf(x.users.find(z => z.username!== value.state.user.username ) )].username}</p>
                                    <p className="message">{x.messages[x.messages.length-1].text.substr(0,50)}</p>
                                </div>
                                
                            </div>
                        </Link>



                    )
                    }
                </div>


            </div>
        )
    }
}
