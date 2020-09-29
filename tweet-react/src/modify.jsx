import React from "react";

export class Modify extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        show: this.props.data,
        cookie: localStorage.getItem("cookie"),
        username: "",
        fullname: "",
        bio: "",
        tel: "",
        birthday: "",
        location: "",
        banner_img: "",
        profil_img: "",
        pwd: "",
        pwdConf: "",
        email: ""
    };

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    delete = (e) => {
        fetch("http://localhost:8080/deleteAccount", {
            method: "POST",
            body: JSON.stringify({ cookie: this.state.cookie }),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                if(val === "success"){
                    localStorage.setItem("cookie", "");
                    window.location.reload();
                }
            });
    };

    verifForm = (e) => {
        e.preventDefault();
        const doc = document;
        const regMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regPhone = /^[0-9]{8,}$/;
        const modify = {
            cookie: this.state.cookie,
            username: this.state.username,
            fullname: this.state.fullname,
            bio: this.state.bio,
            location: this.state.location,
            email: this.state.email,
            birthday: this.state.birthday,
            tel: this.state.tel,
            pwd: this.state.pwd,
            pwdConf: this.state.pwdConf
        };

        modify.username.length === 0 ? doc.getElementById("username").style.color = ""  : modify.username.length < 6 ? doc.getElementById("username").style.color = "red"  : doc.getElementById("username").style.color = "green" ;
        modify.fullname.length === 0 ? doc.getElementById("fullname").style.color = "" : modify.fullname.length < 4 ? doc.getElementById("fullname").style.color = "red" : doc.getElementById("fullname").style.color = "green";
        modify.bio.length === 0 ? doc.getElementById("bio").style.color = "" : modify.bio.length < 10 ? doc.getElementById("bio").style.color = "red" : doc.getElementById("bio").style.color = "green";
        modify.location.length === 0 ? doc.getElementById("location").style.color = "" : modify.location.length < 4 ? doc.getElementById("location").style.color = "red" : doc.getElementById("location").style.color = "green";
        modify.email.length === 0 ? doc.getElementById("email").style.color = "" : !modify.email.match(regMail) ? doc.getElementById("email").style.color = "red" : doc.getElementById("email").style.color = "green";
        modify.birthday.length === 0 ? doc.getElementById("birthday").style.color = "" : Date.now() - Date.parse(modify.birthday) < (60 * 60 * 24 * 365.25 * 18 * 1000) ? doc.getElementById("birthday").style.color = "red" : doc.getElementById("birthday").style.color = "green";
        modify.tel.length === 0 ? doc.getElementById("tel").style.color = "" : !modify.tel.match(regPhone) ? doc.getElementById("tel").style.color = "red" : doc.getElementById("tel").style.color = "green";
        modify.pwd.length === 0 ? doc.getElementById("pwd").style.color = "" : modify.pwd.length < 8 ? doc.getElementById("pwd").style.color = "red" : doc.getElementById("pwd").style.color = "green";
        modify.pwdConf.length === 0 ? doc.getElementById("pwdConf").style.color = "" : modify.pwdConf.length < 8 ? doc.getElementById("pwdConf").style.color = "red" : doc.getElementById("pwdConf").style.color = "green";
        modify.pwd !== modify.pwdConf ? doc.getElementById("pwd").style.color = "red" : doc.getElementById("pwd").style.color = "green";
        modify.pwdConf !== modify.pwd ? doc.getElementById("pwdConf").style.color = "red" : doc.getElementById("pwdConf").style.color = "green";

        if (modify.pwd !== modify.pwdConf){
            doc.getElementById("error").innerHTML = "Relisez vous.";
            return false;
        }
        else fetch("http://localhost:8080/modifyAccount", {
            method: "POST",
            body: JSON.stringify(modify),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                console.log(val);
                if (val === "success"){
                    console.log(val);
                }
            });
    };

    changeImg = (e) => {
        let formData = new FormData();
        let file = e.target.files[0];
        formData.append("file", file);
        formData.append("cookie", this.state.cookie);
        formData.append("type", e.target.getAttribute("data"));
        const options = {
            method: "POST",
            body: formData
        };
        fetch("http://localhost:8080/uploadImage", options).then((resp) => resp.json())
            .then(val => {
                console.table(val);
                this.setState({ refreshWall: true });
            });
    };

    componentWillReceiveProps(props) {
        console.log(props);
        this.setState({ show: props.data });
        this.render();
    }

    render() {
        if(this.state.show === true) {
            return (
                <div className="card text-center" id="modif">
                    <div className="card-header text-twitter-4">
                        <h2>Modify</h2>
                    </div>
                    <div className="card-body text-twitter-5">
                        <div id="error" className="text-center text-danger"/>
                        <div className="row">
                            <div className="col-md-3">
                                <label htmlFor="username">Username:</label>
                                <input className="u-full-width" type="text" placeholder="New username"
                                       id="username" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="fullname">Pseudo:</label>
                                <input className="u-full-width" type="text" placeholder="New pseudo" id="fullname" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="bio">Bio:</label>
                                <input className="u-full-width" type="text" placeholder="New Bio" id="bio" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="location">Locations:</label>
                                <input className="u-full-width" type="text" placeholder="New locations"
                                       id="location" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="email">Mail:</label>
                                <input className="u-full-width" type="text" placeholder="New mail" id="email" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="tel">Phone:</label>
                                <input className="u-full-width" type="text" placeholder="New phone" id="tel" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="birthday">Birthday:</label>
                                <input className="u-full-width" type="date" id="birthday" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <form method="post" action="" encType="multipart/form-data">
                                    <label className="custom-file">
                                        <input type="file" id="modifProfilImg" data="profil" className="custom-file-input" onChange={this.changeImg}/>
                                            <span className="btn btn-twitter-5 custom-file-control">Profile image</span>
                                    </label>
                                </form>
                            </div>
                            <div className="col-md-3">
                                <form method="post" action="" encType="multipart/form-data">
                                    <label className="custom-file" htmlFor="modifBannerImg">
                                        <input type="file" id="modifBannerImg" data="banner" className="custom-file-input" onChange={this.changeImg}/>
                                            <span className="btn btn-twitter-5 custom-file-control">Banner image</span>
                                    </label>
                                </form>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="pwd">Password:</label>
                                <input className="u-full-width" type="password" placeholder="New password"
                                       id="pwd" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="pwdConf">New Password:</label>
                                <input className="u-full-width" type="password" placeholder="New password"
                                       id="pwdConf" onChange={this.inputChange}/>
                            </div>
                            <div className="col-md-3">
                                <article className="btn btn-danger" id="delete" onClick={this.delete}>Delete</article>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="row">
                            <article className="col-lg-5"/>
                            <a id="modifValid" href="#" className="col-lg-2 btn btn-twitter-5" onClick={this.verifForm}>
                                <h2>Valid</h2>
                            </a>
                            <article className="col-lg-5"/>
                        </div>
                    </div>
                </div>
            );
        }
        else return null;
    }
}