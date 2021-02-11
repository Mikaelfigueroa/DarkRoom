import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link,Redirect,  useHistory,
} from 'react-router-dom'
import { MyContext } from "../myProvider"


class Landing extends React.Component {
  static contextType = MyContext;

    render() {
      let value = this.context;
      console.log(value.state)
      return (

        <div>
            <div>
              <p>landing</p>
              
            </div>
            <div>

            </div>
        </div>
      )
    }
  }
  export default Landing;