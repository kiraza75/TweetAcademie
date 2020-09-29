import React from "react";


export class Follower extends React.Component{
    constructor(props) {
        super(props);
    };

    state = {
        cookie: localStorage.getItem("cookie")
    };

    componentWillReceiveProps(nextProps) {
       this.setState({ show: nextProps.data })
    };

    componentDidMount() {
        fetch("http://localhost:8080/getFollow", {
            method: "POST",
            body: JSON.stringify({cookie: this.state.cookie}),
            headers: {
                "content-type": "application/json"
            }}).then((resp) => resp.json())
            .then(val => {
                console.table(val);
                this.setState({result: val});
            });
    };

    render() {
        if (this.state.show)
            return (
                <>
                    {this.state.result.map(x => (
                        <>
                            <hr/>
                            <div className="row">
                                <img src={x.profil_img} className="col-4" alt="Profile"/>
                                <a className="text-twitter-5 col-6">{x.username}</a>
                            </div>
                        </>
                    ))}
                </>
            );
        else return (
            <a/>
        );
    };
}