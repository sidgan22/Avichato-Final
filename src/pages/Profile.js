import React, { Component } from "react";
import Header from "../components/Header";
import {  auth } from "../services/firebase";

class Profile extends Component {
    constructor() {
        super();

        this.state = {
            name: "",
            pUrl: "",
            bio: "This is my bio"
        }
    }
    componentDidMount() {

        this.getDet();
    }
    showCard(){
        alert("UID is: "+auth().currentUser.uid);
    }
    getDet() {
        var name = auth().currentUser.displayName;
        var purl = auth().currentUser.photoURL;
        this.setState({ name: name, pUrl: purl });
        // const uRefN = db.ref().child('users/'+uidadmin+"/name");
        //    console.log("User id is "+uidadmin);
        //    uRefN.transaction(function (current_value) {
        //        this.setState({name:current_value});
        //      return (current_value || "") + x.user.email;
        //    });
        //    const uRefP = db.ref().child('users/'+uidadmin+"/photoURL");
        //    console.log("User id is "+uidadmin);
        //    uRefP.transaction(function (current_value) {
        //      return (current_value || "") + x.user.photoURL;
        //    });
    }
    render() {
        return (
            <div className="prof">
                <Header />
                <div className="card">
                    <img src={this.state.pUrl} alt="John" className="profimg" />
                    <h1>{this.state.name}</h1>
                    <p className="title">{this.state.bio}</p>
                    <p><button className="ct" onClick={this.showCard}>Sharable ID</button></p>
                </div>
            </div>
        );
    }
}

export default Profile;