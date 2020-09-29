import React from "react";

export class Wall extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        cookie: localStorage.getItem("cookie"),
        isLoaded: false,
        refresh: this.props.data,
        isSearch: false
    };

    like = (e) => {
        fetch("http://localhost:8080/like", {
            method: "POST",
            body: JSON.stringify({
                cookie: this.state.cookie,
                id: e.target.getAttribute("data")
            }),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                console.table(val);
                this.componentDidMount();
            });
    };

    delete = (e) => {
        fetch("http://localhost:8080/deleteTweet", {
            method: "POST",
            body: JSON.stringify({
                cookie: this.state.cookie,
                id: e.target.getAttribute("data")
            }),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                console.table(val);
                this.componentDidMount();
            });
    };

    retweet = (e) => {
        fetch("http://localhost:8080/retweet", {
            method: "POST",
            body: JSON.stringify({
                cookie: this.state.cookie,
                id: e.target.getAttribute("data")
            }),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                console.table(val);
                this.componentDidMount();
            });
    };

    setTweetFormat = (tweet) => {
        let traitement = tweet+" ";
        if (traitement.charAt(0) === "#") {
           return  (<a className="text-twitter-5" data={ tweet.substr(1, tweet.length - 1)} onClick={this.callback} style={{cursor: "pointer"}}> { traitement }</a>);
        } else if (traitement.charAt(0) === "@") {
           return (<a className="text-twitter-5 search" data={ tweet.substr(1, tweet.length - 1)} onClick={this.callback} style={{cursor: "pointer"}}>{ traitement }</a>);
        }
        return traitement;
    };

    callback = (e) => {
        if(e.target.innerText.charAt(0) === "@") {
            this.setState({ refresh: false });
            this.props.callback(e.target.innerText);
            fetch("http://localhost:8080/getWallTweet", {
                method: "POST",
                body: JSON.stringify({cookie: this.state.cookie, id: e.target.innerText.substr(1, e.target.innerText.length - 1)}),
                headers: {
                    "content-type": "application/json"
                }
            }).then((resp) => resp.json())
                .then(val => {
                    this.setState({tweet: val});
                    this.setState({isLoaded: true});
                    console.log(this.state)
                });
        }
        else {
            this.setState({ refresh: false });
            fetch("http://localhost:8080/search", {
                method: "POST",
                body: JSON.stringify({ search: e.target.getAttribute("data") }),
                headers: {
                    "content-type": "application/json"
                }
            }).then((resp) => resp.json())
                .then(val => {

                    this.setState({tweet: val});
                    this.setState({isLoaded: true});
                    console.log(this.state)
                });
        }
    };

    componentDidMount() {
        fetch("http://localhost:8080/getWallTweet", {
            method: "POST",
            body: JSON.stringify({cookie: this.state.cookie}),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                this.setState({tweet: val});
                this.setState({isLoaded: true});
                console.log(this.state)
            });
    }

    componentWillReceiveProps(props) {
        console.log("Wall " + props);
        console.log("here" + this.props.isSearch);
        if (this.state.refresh)
            this.componentDidMount();
        if(props.searchBar)
            this.setState({ tweet: props.searchBar, isSearch: true})
    }

    render() {

        if (!this.state.isLoaded) {
            return <div>Loading…</div>;
        } else {
             let content = this.state.tweet.map(x => (x.content.split(" ").map(y => (
                this.setTweetFormat(y)
            ))));

            let count = 0;
            return (
                <div className="container" id="showTweet">
                    {this.state.tweet.map(x => (
                            <div className="card">
                                <div className="card-header bg-twitter-6 text-white d-flex justify-content-between">
                                    Tweet
                                    <a data={x.id} className="deleteTweet btn btn-sm btn-danger" onClick={this.delete}>X</a>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <img src={x.profil_img} alt="Profile image" className="card-img-top col-md-3"
                                             style={{borderRadius: "999999px"}}/>
                                        <div className="col-md-3">
                                            <p className="text-twitter-5" style={{cursor: "pointer"}} onClick={this.callback}>{"@" + x.username}</p>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="text-muted">{Date(Date.parse(x.date)).substr(0, 15)}</p>
                                        </div>
                                        <div className="col-md-12 text-center" >
                                            { content[count++] }
                                        </div>
                                        <img className="col-md-12" src={x.paths}/>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <button data={x.id} className="like btn btn-sm btn-twitter-2" onClick={this.like}>Like
                                    </button>
                                    <article className="text-twitter-5"
                                             dangerouslySetInnerHTML={{__html: x.likes + "&hearts;"}}/>
                                    <article className="text-twitter-5"
                                             dangerouslySetInnerHTML={{__html: x.retweet + "&#8362;"}}/>
                                    <button data={x.id} className="like btn btn-sm btn-twitter-2"
                                            onClick={this.retweet}>Retweet
                                    </button>
                                </div>
                            </div>
                        )
                    )
                    }
                </div>
            );
        }
    }
}