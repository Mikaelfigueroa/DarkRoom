import React from 'react';
import {
    BrowserRouter as Router, Route, Link, Redirect, useHistory,
} from 'react-router-dom'
import axios from 'axios';

class LoadPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            users: {
                posts: []
            }
        };

    }
    render() {
        return (
            <div className="load-posts">
                {this.props.posts[0] == undefined && this.props.caller == "search" && <p>no posts found</p>}
                {
                    this.props.posts.map(x =>
                        <Link to={"/post/" + x._id} className="load-posts-image-cont">

                                <img src={x.image} />

                        </Link>
                    )
                }
            </div>
        )
    }
}


export default LoadPosts