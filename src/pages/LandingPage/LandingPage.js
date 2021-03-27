import {React, useState, useEffect} from 'react';
import "./LandingPage.css";
import Modal from "react-responsive-modal";
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import logo from '../../images/logo.png';

import loginVali from './SignInValidation';
import signUpVali from './SignUpValidation';

export default function LandingPage(){
    const history = useHistory();

    const [userEmail, GetEmail] = useState('') // userEmail is the email from the user
    const [SSstatus, setSSstatus] = useState(0); // SS = sign in sign up
    const [signinStatus, GetSignInStatus] = useState(false) // sign in status
    const [BEresponse, GetBEresponse] = useState('') // BE = backend 

    Axios.defaults.withCredentials = true;
    
    // set (Sign in) Status
    const signInS = () => {
        if (signinStatus === true) {
            history.push("/home")
        }
        setSSstatus(1)
    }

    // set Sign Up status
    const signUpS = () => {
        if (signinStatus === true) {
            history.push("/home")
        }
        setSSstatus(2)
    }

    const closemodal = () => {
        if (signinStatus === true) {
            history.push("/home")
        }
        setSSstatus(0)
    }

    const homepage = () => {
        history.push("/home")
    }
    
    const loginfunc = (result) => {
        Axios.post("https://conhut.herokuapp.com/signin", {
            email: result.email,
            password: result.password
        }).then((response) => {
            if (response.data.message) {
                GetBEresponse(response.data.message)
            } else {
                history.push("/home")
            }
        })
    }

    const signupfunc = (result) => {
        Axios.post("https://conhut.herokuapp.com/signup", {
            email: result.email,
            dob : result.dob,
            password: result.password,
        }).then((response) => {
            console.log(response)
            if (response.data.loggedIn === true) {
                history.push("/home")
            }
            if (response.data.message) {
                GetBEresponse(response.data.message);
            } 
        })
    }

    useEffect(() => {
        // Axios.post("https://conhut.herokuapp.com/autorun/1")
        Axios.get("https://conhut.herokuapp.com/getaccount").then((result) => {
            if (result.data.loggedIn === true) {
                GetSignInStatus(true)
                GetEmail(result.data.user[0].email) 
            } else {
                GetSignInStatus(false)
            }
        });

    }, []); // remove the , [] later on 

    return(
            <div className="landingPage">
            {signinStatus === false && <div className="LandingDivRight">
                <img className="logo" src={logo}/>
                <h1 className="header1">Spice up your confession</h1>
                <p className="para1">Join ConHut today</p>
                <button className="signInBtn" id="signIn" onClick={signInS}>Sign In</button>
                <button className="signUpBtn" id="signUp" onClick={signUpS}>Sign Up</button>
            </div>}
            {signinStatus === true && <div className="changeme">
                <img className="logo" src={logo}/>
                <div className="block1"></div>
                    <a className="row"><h1>Logged in as:</h1><p>{userEmail}</p></a>
                <button className="loggedInBtn" id="alrsignin" onClick={homepage}>Login</button>
            </div>}
            {SSstatus === 1 && <div className="modalDiv">
            {/* LOGIN PAGE */}
                <Modal open={true} onClose={closemodal} classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}>
                <div className="LoginPage">
                    <h2 className="loginHeader">Login</h2>
                    <Formik
                    initialValues={{
                    email: "",
                    password: "",
                    }}
                    validationSchema={loginVali}
                    onSubmit={loginfunc}
                    >
                    <Form style={{ display: "flex", flexDirection: "column" }}>
                    <Field className="textfield" name="email" type="email" placeholder="Email..." />
                    <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="block1"></div>
                    <Field className="textfield" name="password" type="password" placeholder="Password..." />
                    <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="block2"></div>
                    <a className="forgetPass">Forget password?</a>

                    <div className="row">
                        <button className="loginbtn" type="submit">Submit</button>
                    </div>
                    <p className="response">{BEresponse}</p>
                    <p className="signintext">Don't have an account? <a className="signUpText" onClick={signUpS}>Sign Up</a>.</p>
                    </Form>
                </Formik>
                </div>
                </Modal>
            </div>}
            {/* SIGN UP PAGE */}
            {SSstatus === 2 && <div className="modalDiv">
                <Modal open={true} onClose={closemodal} classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}>
                    <div className="SignUpPage">
                    <h2 className="signupHeader">Sign up Page</h2>
                    <Formik
                        initialValues={{
                        email: "",
                        dob: "",
                        password: "",
                        }}
                        validationSchema={signUpVali}
                        onSubmit={signupfunc}
                    >
                    <Form style={{ display: "flex", flexDirection: "column" }}>
                    <Field className="textfield" name="email" type="email" placeholder="Email..." />
                    <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="block1"></div>
                    <Field className="textfield" name="dob" type="date" placeholder="Date of Birth" />
                    <ErrorMessage
                        name="dob"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="block1"></div>
                    <Field className="textfield" name="password" type="password" placeholder="Password" />
                    <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="row">
                        <button className="loginbtn" type="submit">Submit</button>
                        <p className="response">{BEresponse}</p>
                    </div>
                    <p className="signintext">Have an account? <a className="signUpText" onClick={signInS}>Sign In</a>.</p>
                    </Form>
                </Formik>
                </div>
                </Modal>
            </div>}
        </div>
        
    )
}



   