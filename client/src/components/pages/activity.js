import React, { Component } from 'react'
import { BrowserRouter as Router, Redirect, Link } from 'react-router-dom'
import Axios from 'axios'
import { MyContext } from "../myProvider"


export default class Activity extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props)

        this.state = {
            activity: [],
            redirect: null
        }
    }
    componentDidMount() {
        let value = this.context
        if(!value.state.user.username){
            this.setState({redirect: "/login"})
        }
        Axios({
            method: "GET",
            url: "/activity"
        }).then((res) => {
            this.setState({ activity: res.data })
            console.log(this.state.activity)
        })
    }
    render() {
        if(this.state.redirect){
            return <Redirect to={this.state.redirect}/>
        }
        return (

            <div className="activity-page">
                <p className="bolded">Actvity</p>
                {this.state.activity.length == 0 && 
                    <p>No Activity</p>
                }
                <div className="activity-container">
                {this.state.activity.map(x =>
                    <div className="activity">
                        {x.typeof == "like" ?
                            <Link to={{ pathname: "/post/" + x.linkid }}>
                                <img className="profile-image" src={x.user.image} alt="" />

                                <p>{x.user.username + " liked your post"}</p>

                            </Link>
                            :
                            <Link to={{pathname: "/profile/" + x.linkid}}>
                                <img className="profile-image" src={x.user.image} alt="" />

                                <p>{x.user.username + " started following you"}</p>

                            </Link>
                        }
                    </div>
                )}
                </div>

            </div>
        )
    }
}
