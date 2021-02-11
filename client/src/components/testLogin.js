import React, { Component } from 'react'
import { MyContext } from "./myProvider"
import axios from 'axios';
import Logout from "./logout";


export default class TestLogin extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props)
        this.state = {
            error: null
        }
        this.testLogin = this.testLogin.bind(this)
    }
    testLogin(event) {
        let value = this.context;
        event.preventDefault();




        // tool to set user to bypass needing user need to add a input on form with the user id
        /*value.setUser(
            {
                username: event.target.children[0].value,
                _id: event.target.children[2].value,
                posts: [],
                followers: [],
                following: [],
                image: "https://res.cloudinary.com/dbjw5nvs2/image/upload/v1597543434/uzcomz6xzdioqj34jcwj.jpg"
            }

        )*/
        
        //<input type="text" value="5f3eecf400087e32dca180fb"/>
        //<input type="text" value="5f3eed2700087e32dca180fc"/>


        axios({
            method: "POST",
            data: {
                username: event.target.children[0].value,
                password: event.target.children[1].value
            },
            url: "/login",
        }).then(res => {
            let value = this.context;
            value.setUser(res.data)
        }
        ).catch(err => {
            this.setState({ error: err.response.data.message })
        });


    }

    render() {
        let value = this.context;
        return (
            <div id="testing-logins">
                <div>
                    <div style={{ position: "fixed", backgroundColor: "white", bottom: "30vh" }}> <p>{this.state.error}</p> </div>
                    <form onSubmit={this.testLogin} style={{ position: "fixed", backgroundColor: "red", top: "50vh", left: "0" }}>
                        <input name="username" type="string" value="a1" style={{ display: "none" }} />

                        <input name="password" type="password" value="6498688676" style={{ display: "none" }} />


                        <input style={{ backgroundColor: "red", color: "white" }} type="submit" value="a1" />
                    </form>
                </div>
                <div>
                    <form onSubmit={this.testLogin} style={{ position: "fixed", backgroundColor: "red", top: "50vh", right: "0" }}>
                        <input name="username" type="string" value="a2" style={{ display: "none" }} />

                        <input name="password" type="password" value="6498688676" style={{ display: "none" }} />
                        <input style={{ backgroundColor: "red", color: "white" }} type="submit" value="a2" />
                    </form>
                </div>
                <div>
                    <form onSubmit={this.testLogin} style={{ position: "fixed", top: "70vh", left: "0" }}>
                        <input name="username" type="string" value="a3" style={{ display: "none" }} />

                        <input name="password" type="password" value="6498688676" style={{ display: "none" }} />

                        <input style={{ backgroundColor: "red", color: "white" }} type="submit" value="a3" />
                    </form>
                </div>
                <div>
                    <form onSubmit={this.testLogin} style={{ position: "fixed", backgroundColor: "red", top: "70vh", right: "0" }}>
                        <input name="username" type="string" value="a4" style={{ display: "none" }} />

                        <input name="password" type="password" value="6498688676" style={{ display: "none" }} />

                        <input style={{ backgroundColor: "red", color: "white" }} type="submit" value="a4" />
                    </form>
                </div>
                <div style={{ backgroundColor: "red", color: "white", position: "fixed", top: "85vh", left: "0" }}>
                    <p> {value.state.user.username}</p>
                    <Logout />
                </div>
            </div>
        )
    }
}
