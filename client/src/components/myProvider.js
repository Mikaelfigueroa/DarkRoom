import React, { createContext, Component } from 'react'
import Axios from 'axios';
import socketIOClient from "socket.io-client";
export const MyContext = createContext();  //exporting context object



class MyProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        username: null,
        _id: null,
        posts: [],
        followers: [],
        following: [],
        image: null
      },
      checked: false
    }
  }




  componentDidMount() {
    Axios({
      method: "GET",
      url: "/isloggedin"
    }).then(res => {
      if (res.data) {
        console.log(res.data)
        this.setState({ user: res.data })
      }
      this.setState({ checked: true })
    })

  }

  render() {
    return (

      <MyContext.Provider value={
        {
          state: this.state,
          logOutUser: () => {
            this.setState({
              user: {
                username: null,
                _id: null,
                posts: [],
                followers: [],
                following: [],
                image: null
              }
            })},
          setUser: (value) => {
            this.setState({ user: value })
          }
        }
      }>
        {this.props.children}
      </MyContext.Provider>)
  }
}

export default MyProvider;
