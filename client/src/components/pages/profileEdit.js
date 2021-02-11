import React from 'react';
import {
    BrowserRouter as Router, Route, Link, Redirect, useHistory,
} from 'react-router-dom'
import axios from 'axios';
import { MyContext } from "../myProvider"


class ProfileEdit extends React.Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            redirect: null,
            user: {
                username: null,
                _id: null,
                posts: [],
                followers: [],
                following: [],
                image: null
            },
            image: null,
            file: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.imagePreview = this.imagePreview.bind(this)
    }
    goBack() {
        this.props.history.goBack()
    }
    handleSubmit(event) {
        event.preventDefault()
        var formData = new FormData();
        if (this.state.file) {
            var imageFile = document.querySelector('#imageinput');
            formData.append("image", imageFile.files[0]);
        }
        if (document.getElementById('caption').value.length > 0) {
            formData.append("caption", document.getElementById('caption').value)
        }
        axios.put('/user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            let value = this.context;
            value.setUser(res.data)
            this.setState({ redirect: "/profile/" + value.state.user._id })
        })
    }

    imagePreview(event) {
        this.setState({ image: URL.createObjectURL(event.target.files[0]) })
        this.setState({ file: true })
    }
    componentDidMount() {
        let value = this.context;
        console.log(value.state)
        this.setState({ user: value.state.user })
        this.setState({ image: value.state.user.image })
    }

    render() {
        let value = this.context;
        
        if (!value.state.user.username) {
            this.props.history.goBack()
        }
        if (this.state.redirect) {
            return <Redirect to={"/profile/" + value.state.user._id} />
        }
        return (
            <div className="profile-edit-cont">
                <div className="header">
                    <span>
                        <i class="fas fa-arrow-left" onClick={this.goBack}></i>
                        <p>Profile</p>
                    </span>
                </div>
                <div className="profile-edit">

                    <h1>Edit Profile</h1>

                    <img id="imagepreview" src={this.state.image} />
                    <label className="image-label" for="imageinput">Change Profile Photo</label>
                    <input onInput={this.imagePreview} type="file" name="image" accept="image/*" id="imageinput"></input>

                    <form className="edit-profile-form" onSubmit={this.handleSubmit}>
                        <input id="caption" placeholder="Bio" />
                        <input type="submit" value="Upate Profile" />
                    </form>

                </div>

            </div>
        )
    }
}
export default ProfileEdit