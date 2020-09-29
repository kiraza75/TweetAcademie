import React from "react";
import { Login } from "./login";

export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: true};
    }

    state = {
        user: "",
        pass: "",
        passConf: "",
        mail: "",
        phone: "",
        date: ""
    };

    login = (e) => {
        this.setState({ show: false });
    };

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        console.log(this.state)
    };

    verifForm = (e) => {
        e.preventDefault();
        const doc = document;
        const regMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regPhone = /^[0-9]{8,}$/;
        this.state.user.length < 6 ? doc.getElementById("user").style.color = "red" : doc.getElementById("user").style.color = "green";
        this.state.pass.length < 8 ? doc.getElementById("pass").style.color = "red" : doc.getElementById("pass").style.color = "green";
        this.state.passConf.length < 8 ? doc.getElementById("passConf").style.color = "red" : doc.getElementById("passConf").style.color = "green";
        this.state.pass !== this.state.passConf ? doc.getElementById("pass").style.color = "red" : doc.getElementById("pass").style.color = "green";
        this.state.passConf !== this.state.pass ? doc.getElementById("passConf").style.color = "red" : doc.getElementById("passConf").style.color = "green";
        Date.now() - Date.parse(this.state.date) < (60 * 60 * 24 * 365.25 * 18 * 1000) ? doc.getElementById("date").style.color = "red" : doc.getElementById("date").style.color = "green";
        !this.state.mail.match(regMail) ? doc.getElementById("mail").style.color = "red" : doc.getElementById("mail").style.color = "green";
        !this.state.phone.match(regPhone) ? doc.getElementById("phone").style.color = "red" : doc.getElementById("phone").style.color = "green";
        if (this.state.user.length < 6 || this.state.pass !== this.state.passConf || Date.now() - Date.parse(this.state.date) < (60 * 60 * 24 * 365.25 * 18 * 1000) ||  !this.state.mail.match(regMail) || this.state.pass.length < 8 || !this.state.phone.match(regPhone)){
            doc.getElementById("error").innerHTML = "Verify your information";
            return false;
        }
        else {
            doc.getElementById("error").innerHTML = "";
            this.sendForm();
            return true;
        }
    };

    sendForm = () => {
        console.log("test");
        fetch("http://localhost:8080/inscription", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                console.log(val);
                if(val === "success")
                    this.setState({ show: false });
            });
    };

    render() {
        if(this.state.show) {
            return (
                <form>
                    <div className="container">
                        <div className="text-danger text-center" id="error"/>
                        <div className="row">
                            <div className="four columns">
                                <label htmlFor="username">Username</label>
                                <input className="u-full-width" type="text" placeholder="Username" id="user"
                                       onChange={this.inputChange}/>
                            </div>
                            <div className="four columns">
                                <label htmlFor="password">Password</label>
                                <input className="u-full-width" type="password" placeholder="Password" id="pass"
                                       onChange={this.inputChange}/>
                            </div>
                            <div className="four columns">
                                <label htmlFor="passwordConf">Password Confirm</label>
                                <input className="u-full-width" type="password" placeholder="Password" id="passConf"
                                       onChange={this.inputChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="four columns">
                                <label htmlFor="date">Birthday</label>
                                <input className="u-full-width" type="date" id="date" onChange={this.inputChange}/>
                            </div>
                            <div className="four columns">
                                <label htmlFor="mail">Mail</label>
                                <input className="u-full-width" type="text" placeholder="Mail" id="mail"
                                       onChange={this.inputChange}/>
                            </div>
                            <div className="four columns">
                                <label htmlFor="phone">Phone</label>
                                <input className="u-full-width" type="tel" placeholder="Phone" id="phone"
                                       onChange={this.inputChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="two columns">
                                <label htmlFor="submit"/>
                                <button className="button-primary" id="submit" onClick={this.verifForm}>Register
                                </button>
                            </div>
                            <div className="two columns">
                                <label htmlFor="submit"/>
                                <button className="button" id="login" onClick={this.login}>Login</button>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
        else return (
            <Login />
        );
    }
}