import React from 'react';
import {
    BrowserRouter as Router, Route, Link, Redirect, useHistory,
} from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "./myProvider"


class searchForm extends React.Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }



    handleSubmit(event) {
        event.preventDefault();
        axios({
            method: "POST",
            data: { search: document.getElementById('search').value, },
            withCredentials: true,
            url: this.props.url
        }).then(res => {
            this.props.parentCallback(res.data)
        })
        event.target.reset()
    }
    render() {
        let value = this.context;
        return (

            <form className="search-form" onSubmit={this.handleSubmit}>
                <span><i class="fas fa-search"></i><input id="search" type="text" name="search" placeholder="search..." /></span>
            </form>
        )
    }
}


export default searchForm