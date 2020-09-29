import React from "react";
import {Register} from "./register";

export class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        show: true,
        password: "",
        username: ""
    };

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        console.log(this.state)
    };

    register = (e) => {
      this.setState({ show: false });
    };

    verifLogin = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/login", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "content-type": "application/json",
            }
        }).then((res) => res.json())
            .then(val => {
                console.log(val);
                if (val.length > 50) {
                    localStorage.setItem("cookie", val);
                    window.location.reload();
                }
            })
    };

    render() {
        if(this.state.show === true) {
            return (
                <form id="login">
                    <div className="container" id="error"/>
                    <div className="container">
                        <div className="row">
                            <div className="four columns">
                                <label htmlFor="username">Username</label>
                                <input className="u-full-width" type="text" placeholder="Username" id="username"
                                       onChange={this.inputChange}/>
                            </div>
                            <div className="four columns">
                                <label htmlFor="password">Password</label>
                                <input className="u-full-width" type="password" placeholder="Password" id="password"
                                       onChange={this.inputChange}/>
                            </div>
                            <div className="two columns">
                                <label htmlFor="submit"/>
                                <button className="button-primary" id="submit" onClick={this.verifLogin}>Login</button>
                            </div>
                            <div className="two columns">
                                <label htmlFor="register"/>
                                <button className="button" id="register" onClick={this.register}>Register</button>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
        else return (
            <Register />
        );
    }
}