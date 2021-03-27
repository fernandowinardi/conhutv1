import React, {useState} from 'react';
import Axios from 'axios';
import Validation from './Validation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useHistory } from 'react-router-dom';

import "./ChangePassword.css"

export default function ChangePassword() {
    const history = useHistory();

    const [passwordChanged, PCStatus] = useState(false) // PC = password changed
    const [BEresponse, GetBEr] = useState('') // backend response

    const CP = (result) => { // child porn lol
        Axios.post("https://conhut.herokuapp.com/changepassword", {
            password: result.Epassword,
            newpassword: result.Npassword
        }).then((response) => {
            if (response.data.status === true) {
                GetBEr(response.data.message)
                PCStatus(true)
            } else {
                GetBEr(response.data.message)
            }
        })
    }

    const logout = () => {
        PCStatus(false)
        Axios.post("https://conhut.herokuapp.com/logout", {})
        history.push("/")
    }
    
    return (
        <div className="ChangePassword">
            {passwordChanged === false && <div>
                <Formik
                    initialValues={{
                    Epassword: "",
                    Npassword: "",
                    }}
                    validationSchema={Validation}
                    onSubmit={CP}
                    >
                    <Form style={{ display: "flex", flexDirection: "column" }}>
                    <Field className="textfield" name="Epassword" type="password" placeholder="Existing Password..." />
                    <ErrorMessage
                        name="Epassword"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="block1"></div>
                    <Field className="textfield" name="Npassword" type="password" placeholder="New Password..." />
                    <ErrorMessage
                        name="Npassword"
                        component="div"
                        className="invalid-feedback"
                        style={{ color: "red", fontWeight: "bold" }}
                    />
                    <div className="block1"></div>
                    <div className="row">
                        <button className="CP-btn" type="submit">Submit</button>
                    </div>
                    <div>
                        <p>{BEresponse}</p>
                    </div>
                    </Form>
                </Formik>
            </div>}
            {passwordChanged === true && <div>
                <p>{BEresponse}</p>
                <p>Click <a onClick={logout}><u>here</u></a> if you would like to logout all devices!</p>
            </div>}
        </div>
    )
}