import React from "react";
import {Wall} from "./wall";
import {Follower} from "./follower";
import {Following} from "./following";
import {Modify} from "./modify";

export class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cookie: localStorage.getItem("cookie"),
            showFollower: false,
            showFollowing: false,
            showModify: false,
            show: this.props.data,
            id_u: "",
            username: "",
            fullname: "",
            bio: "",
            tel: "",
            birthday: "",
            location: "",
            verified: "",
            banner_img: "",
            profil_img: "",
            nbr_follow: "",
            nbr_abo: "",
        };
    }

    bannerImg = {
        height: "300px",
        objectFit: "cover"
    };



    getInput = (e) => {
        this.setState({inputTweet: e.target.value});
    };

    tweet = (e) => {
        e.preventDefault();
        let body = {
            cookie: this.state.cookie,
            tweet: this.state.inputTweet,
            type: "tweet"
        };
        let formData = new FormData();
        let file = document.getElementById('tweetImg').files[0];
        if (file !== undefined) {
            if (file.type.indexOf("image/") !== -1)
                body.type = "image";
            formData.append("file", file);
        }
        formData.append("body", JSON.stringify(body));
        const options = {
            method: "POST",
            body: formData
        };
        if (this.state.inputTweet !== undefined && this.state.inputTweet.length > 0 && this.state.inputTweet.length < 141) {
            fetch("http://localhost:8080/tweet", options).then((resp) => resp.json())
                .then(val => {
                    console.table(val);
                    this.setState({refreshWall: true});
                });
        }
    };

    showFollow = (e) => {
        if (!this.state.showFollower)
            this.setState({showFollower: true});
        else this.setState({showFollower: false});
    };

    showFollowing = (e) => {
        if (!this.state.showFollowing)
            this.setState({showFollowing: true});
        else this.setState({showFollowing: false});
    };
    showModify = (e) => {
        this.setState({
            showModify: true,

        })
    }
    sleep = async (ms) => {
        await new Promise(resolve => setTimeout(resolve, ms));
        return true;
    };

    callback = async (data) => {
        this.setState({refreshWall: false});
        console.log(data.charAt(0));
        if (data.charAt(0) === "@") {
            this.setState({id: data.substr(1, data.length - 1)});
            await this.sleep(200);
            this.componentDidMount();
        }
    };

    componentDidMount() {
        fetch("http://localhost:8080/getInfo", {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
                "content-type": "application/json",
            }
        }).then((res) => res.json())
            .then(data => {
                console.table(data);
                if (data.info !== undefined) {
                    data.info.verified === 1 ? this.setState({username: "@" + data.info.username + "<a style='color: #1e7e34'> ✔</a>️"}) : this.setState({username: "@" + data.info.username});
                    this.setState({id_u: data.info.id});
                    if (data.info.fullname.length > 0)
                        this.setState({fullname: "(" + data.info.fullname + ")"});
                    this.setState({bio: data.info.bio});
                    this.setState({tel: data.info.tel});
                    this.setState({birthday: data.info.birthday});
                    this.setState({registerDate: data.info.registerDate});
                    this.setState({location: data.info.location});
                    this.setState({verified: data.info.verified});
                    this.setState({banner_img: data.info.banner_img});
                    this.setState({profil_img: data.info.profil_img});
                    this.setState({nbr_follow: data.follow.nbr_follow});
                    this.setState({nbr_abo: data.abo.nbr_abo});
                }
            });
    }

    componentWillReceiveProps(props) {
        console.log(props);
        this.setState({ show: props.data });
        this.setState({ id: null });
        this.componentDidMount();
    }

    render() {
        if (this.state.show)
            return (
                <div className="container">
                    <div className="card text-center" id="account">
                        <div className="card-header text-twitter-4">
                            <h2>Your Account</h2>
                            <button className="button-primary" onCLick={this.Modify}>Modify account</button>
                        </div>
                        <img src={this.state.banner_img} style={this.bannerImg} className="card-img-top"
                             id="bannerImage"/>
                        <div className="card-body">
                            <h5 className="card-title">
                                <p id="username" className="text-muted"
                                   dangerouslySetInnerHTML={{__html: this.state.username}}/>
                                <p id="pseudo">{this.state.fullname}</p>
                            </h5>
                            <div className="row">
                                <div className="col-md-4">
                                    <img id="profilImage" style={{borderRadius: "9999px"}} src={this.state.profil_img}
                                         className="mx-auto img-fluid d-block"
                                         alt="avatar"/>
                                </div>
                                <div className="col-md-4">
                                    <p className="text-muted"
                                       id="subscribeDate">{"Register since: " + Date(Date.parse(this.state.registerDate)).substr(0, 15)}</p>
                                    <hr/>
                                    <p>Bio:</p>
                                    <p id="bio">{this.state.bio}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-twitter-5">Followers:</h6>
                                    <h2 className="text-twitter-4" style={{cursor: "pointer"}}
                                        onClick={this.showFollow}>{this.state.nbr_follow}</h2>
                                    <Follower data={this.state.showFollower}/>
                                    <hr/>
                                    <h6 className="text-twitter-5">Following:</h6>
                                    <h2 className="text-twitter-4" style={{cursor: "pointer"}}
                                        onClick={this.showFollowing}>{this.state.nbr_abo}</h2>
                                    <Following data={this.state.showFollowing}/>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer" id="tweetTweet">
                            <div className="text-twitter-2" id="sizeTweet"/>
                            <div>
                                <form className="row" action="" encType="multipart/form-data">
                                    <article className="col-md-3"/>
                                    <textarea id="tweet" placeholder="Max length: 140" className="col-lg-5"
                                              onChange={this.getInput}/>
                                    <label className="custom-file col-md-1" htmlFor="tweetImg">
                                        <input type="file" id="tweetImg" className="custom-file-input"/>
                                        <span className="btn btn-twitter-5 custom-file-control">Img</span>
                                    </label>
                                    <a id="tweeter" href="#" className="col-md-3 btn btn-twitter-5"
                                       onClick={this.tweet}>
                                        <h2>Tweet</h2>
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                        <Modify data={this.state.showModif}/>
                     <Wall callback={this.callback} data={this.state.refreshWall}/>
                </div>
            );
        else return null;
    }
}