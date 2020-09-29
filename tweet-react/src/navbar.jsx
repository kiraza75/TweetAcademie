import React from "react";
import {Account} from "./account";
import {Modify} from "./modify";
import {Wall} from "./wall";

export class NavbarTweet extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
      showAccount: true,
      showModify: false,
       showResults: false,
      showMessage: false,
        searchBar: ""
    };

    showModif = (e) => {
        this.setState({ showResults: false });
        this.setState({ showAccount: false });
        this.setState({ showModify: true });
        this.render();
    };

    showAccount = (e) => {
        this.setState({ showResults: false });
        this.setState({ showModify: false });
        this.setState({ showAccount: true });

        this.render();
    };

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };
    showResults = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/search", {
            method: "POST",
            body: JSON.stringify(this.state.searchBar),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                this.setState({search: val});
                this.setState({ showModify: false });
                this.setState({ showAccount: false });
                this.setState({showResults: true});
                console.log(this.state)
            });
        this.render();
    };

    disconnect = (e) => {
      localStorage.setItem("cookie", "");
      window.location.reload();
    };

    render() {
        return (
            <>
                <nav className="navbar bg-twitter-5 text-white">
                    <a className="navbar-brand" onClick={this.showAccount}>Tweet</a>
                    <a className="nav-item nav-link">Messages</a>
                    <a className="nav-link" onClick={this.showModif}>Account</a>
                    <a className="nav-link" onClick={this.disconnect}>Disconnect</a>
                    <input className=""  id="searchBar" type="search" placeholder="Search" aria-label="Search" onChange={this.inputChange}/>
                    <button className="btn btn-twitter-4 " type="submit" onClick={this.showResults}>Search</button>
                </nav>
                <Wall data={this.state.showResults} searchBar={this.state.search}/>
                <Account data={this.state.showAccount}/>
            </>
        );
    }
}