import React from 'react';
import {
    BrowserRouter as Router, Route, Link
} from 'react-router-dom'
import axios from 'axios';

class LoadUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div>
                {this.props.users[0] == undefined && <p>no users found</p>}
                {
                    this.props.users.map(x =>
                        <Link className="load-users"to={{ pathname: "/profile/" + x._id }}>
                                <img className="profile-image" src={x.image} />
                                <p>{x.username}</p>
                        </Link>

                    )
                }
            </div>
        )
    }
}


export default LoadUsers