import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link,Redirect } from 'react-router-dom'
import {MyContext} from "./myProvider"

class DeletePost extends React.Component {
    static contextType = MyContext;
 
    constructor(props) {
        super(props);
        this.state = {
            redirect: null
        };
        this.deletePost   = this.deletePost.bind(this);
     }
 
    deletePost(){     
        axios.delete("/post/" + this.props.post).then(res=>{
            this.setState({redirect: "/post/index"}) 
        })
    }
    render(){
        let value = this.context;
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return(
            <button onClick={this.deletePost}><i class="fas fa-trash"></i> Delete Post</button>
        )
    }
    
}
export default DeletePost
 