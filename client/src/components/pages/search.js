import React from 'react';
import { BrowserRouter as Router, Route, Link,Redirect,  useHistory,} from 'react-router-dom'
import {MyContext} from "../myProvider"
import SearchForm from "../searchForm"
import LoadPosts from "../loadPosts"
import LoadUsers from "../loadUsers"
import Axios from 'axios';

class Search extends React.Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
          error: "",
          redirect: null,
          url: "/search/user",
          search : "user",
          result: null,
          type: null
        };
        this.callBack     = this.callBack.bind(this);
        this.handleClick  = this.handleClick.bind(this);  
    }
    
    callBack(data){
        this.setState({result: data.result})
        this.setState({type: data.type})
        
    }

    handleClick(event){
        if(event.target.innerHTML == "tags"){
            event.target.classList.add("selected")
            event.target.parentNode.children[0].classList.remove("selected")
            this.setState({search: "post"})
            this.setState({url: "/search/post"})
        }
        else{
            event.target.classList.add("selected")
            event.target.parentNode.children[1].classList.remove("selected")
            this.setState({search: "user"})
            this.setState({url: "/search/user"})
        }
    }   
    componentDidMount(){
        Axios({
            method: "POST",
            url: "/search/user",
            data: {
                search: null
            }
        }).then(res =>{
            this.setState({result: res.data.result})
            this.setState({type: "user"})
        })
    } 
    render(){
        let value = this.context
        return(
            <div>
                <SearchForm url={this.state.url} parentCallback={this.callBack}/>
                <div>
                    <span className="search-toggles">
                        <button className="selected" onClick={this.handleClick}>user</button>
                        <button onClick={this.handleClick}>tags</button>
                    </span>
                </div>
                {value.state.user.username && value.state.user.following.length == 0 && <p>Follow some users to get a personalized feed</p>}
                {this.state.type == "user" ?
                    <LoadUsers users={this.state.result}/>:
                     this.state.type == "post" ? <LoadPosts caller={"search"} posts={this.state.result}/>:
                     null
                }
            </div>
        )
    }
}


export default Search