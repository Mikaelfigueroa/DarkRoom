import React from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, useHistory, withRouter } from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "../myProvider"

class postNew extends React.Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            redirect: "/login",
            post: null,
            file: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.imagePreview = this.imagePreview.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let value = this.context;
        const regex = /(#+[a-zA-Z0-9(_)]{1,})/g;
        var formData = new FormData();
        var imagefile = document.querySelector('#imageinput');
        formData.append("image", imagefile.files[0]);
        formData.append("caption", document.getElementById("caption").value)
        formData.append("hashtags", document.getElementById("caption").value.match(regex))
        axios.post('/post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log(res.data._id)
            this.setState({ post: res.data })
            this.setState({ redirect: "/post/" + res.data._id })

        })
    }

    imagePreview(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }

    render() {
        let value = this.context;
        if (!value.state.user.username) {
            return <Redirect to={this.state.redirect} />
        }

        if (this.state.redirect != "/login") {
            return <Redirect to={{
                pathname: this.state.redirect
            }} />
        }

        return (
            <div className="new-post">

                <h1 className="text-center">New post</h1>
                <form onSubmit={this.handleSubmit} action="/posts" method="POST" enctype="multipart/form-data">



                    <input id="caption" type="text" name="caption" placeholder="Write a caption..." required />

                    {this.state.file && <img id="imagepreview" src={this.state.file} />}

                    <label for="imageinput">Select image</label>
                    <input onChange={this.imagePreview} type="file" name="image" class="form-itm" accept="image/*" id="imageinput" required />



                    <input type="submit" id="submit" value="Post" />
                </form>
            </div>
        )
    }
}

export default postNew;