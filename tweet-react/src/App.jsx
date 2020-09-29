import "./bootdouille.css";
import "./skeleton.css";
import React from "react";
import { Login, Account, NavbarTweet } from "./index.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    if(localStorage.getItem("cookie") !== null && localStorage.getItem("cookie").length >  50) {
      this.state = {
        isLogginActive: true
      };
    }
    else this.state = {
      isLogginActive: false
    };
  }

  render() {
    return (
        <div className="App">
          <div className="login">
            <div className="container-fluid" ref={ref => (this.container = ref)}>
              {this.state.isLogginActive && (
                  <NavbarTweet/>
              )}
              {!this.state.isLogginActive && (
                  <Login containerRef={ref => (this.current = ref)} />
              )}
            </div>
          </div>
        </div>
    );
  }
}

export default App;
