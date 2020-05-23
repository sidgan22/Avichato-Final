import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import logo from '../images/avilight.jpg'
import { auth } from '../services/firebase';


export default class HomePage extends Component {
    
    render() {
        return (
            <div className="home">
                <Header></Header>
                <section>
                    <div className="container text-center py-5">
                        <img src={logo} className="img-responsive" height="200" alt="logo"></img>
                        <h1 className="display-4">Avichato</h1>
                        <p className="lead">Team colab by Aviato</p>
                        {auth().currentUser?null:<div className="mt-4">
                            <Link className="btn btn-primary px-5 mr-3" to="/signup">Create New Account</Link>
                            <Link className="btn px-5" to="/login">Login to Your Account</Link>
                        </div>}
                    </div>
                </section>
                <Footer></Footer>
            </div>
        )
    }
}