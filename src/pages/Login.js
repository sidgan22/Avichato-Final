import React, { Component } from "react";
import { Link } from "react-router-dom";
import {  signInWithGoogle } from "../helpers/auth";
import logo  from "../images/avilight.jpg";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: null,
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

//   async handleSubmit(event) {
//     event.preventDefault();
//     this.setState({ error: "" });
//     try {
//       await signin(this.state.email, this.state.password);
//     } catch (error) {
//       this.setState({ error: error.message });
//     }
//   }

  async googleSignIn() {
    try {
        this.setState({ loading: true });
      await signInWithGoogle();

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }



  render() {

    const {loading} = this.state;
    return (
      <div>
          <div className='left'>
        <img alt="Logo" src={ logo } width='90%' height='50%' />
      </div>
      <div className="containers">
      <form
        className="mt-4 py-3 px-5"
        autoComplete="off"
        onSubmit={this.handleSubmit}
      >
        <h1>
          Login to
          <Link className="title ml-2" to="/">
            Avichato
          </Link>
        </h1>
        
        
        <button className="btn btn-danger mr-2" type="button" onClick={this.googleSignIn} disabled={loading}>
        {loading ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : "Sign in with Google"}
        </button>
        <hr />
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
      </div>
    );
  }
}


//Login Email
//{/* <div className="form-group">
        //     <input
        //       className="form-control"
        //       placeholder="Email"
        //       name="email"
        //       type="email"
        //       onChange={this.handleChange}
        //       value={this.state.email}
        //     />
        //   </div>
        //   <div className="form-group">
        //     <input
        //       className="form-control"
        //       placeholder="Password"
        //       name="password"
        //       onChange={this.handleChange}
        //       value={this.state.password}
        //       type="password"
        //     />
        //   </div>
        //   <div className="form-group">
        //     {this.state.error ? (
        //       <p className="text-danger">{this.state.error}</p>
        //     ) : null}
        //     <button className="btn btn-primary px-5" type="submit">Login</button>
        //   </div>
        //   <p>You can also log in with any of these services</p> */}