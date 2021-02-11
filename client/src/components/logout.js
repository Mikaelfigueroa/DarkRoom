import React, { Component } from 'react'
import {MyContext} from "./myProvider"
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'



export default class Logout extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props)
        
        this.state = {
             redirect: null
        }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick = () => {
        let value = this.context;
        axios.get("/logout").then( res => {
          value.logOutUser()
          this.setState({ redirect: "/post/index"})
        })
    }
    
    render() {
        let value = this.context;
        if(this.state.redirect){
            return <Redirect to={{
                pathname: "/post/index"
              
            }} />
        }
        return (
            <span className="logout-btn-span"><i class="fas fa-sign-out-alt"></i><button onClick={this.handleClick} id="logoutbtn">Logout</button></span>
        )
    }
}
