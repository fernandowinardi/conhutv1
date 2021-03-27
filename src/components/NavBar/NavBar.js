import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import {Link} from "react-router-dom";
import logo from '../../images/logo.png';

import "./NavBar.css";
import CreateConfession from '../CreateConfession/CreateConfession';
import ChangePassword from '../ChangePassword/ChangePassword';
import Modal from "react-responsive-modal";

export default function NavBar() {  
    const [ModalStatus, SetModalStatus] = useState(false)
    const [CPwModal, SetCPwModal] = useState(false)
    const [ShowMenu, SetShowMenu] = useState(false)
    const [role, GetUserRole] = useState('')

    const logout = () => {
        Axios.post("https://conhut.herokuapp.com/logout", {
        })
    }

    const openModal = () => {
        SetModalStatus(true)
    }

    const closeModal = () => {
        SetModalStatus(false)
        window.location.reload();
    }

    const openMenu = () => {
        if(ShowMenu === true) {
            SetShowMenu(false)
        }  else {
            SetShowMenu(true)
        }
    }

    const closeMenu = () => {
        if(ShowMenu===true){
           SetShowMenu(false) 
        }     
    }

    useEffect(() => {
        // Axios.post("https://conhut.herokuapp.com/autorun/1") // auto run this at backend 
        Axios.get("https://conhut.herokuapp.com/getaccount").then((result) => {
            if (result.data.user !== undefined) {
                if (result.data.user[0].usertype === "admin") {
                    GetUserRole(result.data.user[0].usertype)
                }
            }
        });
        console.log(role)
    }, []); // remove the , [] later on 

    return ( 
        <div>
            <nav className="navBar" onClick={closeMenu}>
                <li>
                    <a href="/home" className="options"><Link to="/home"><img className="logoClass" src={logo}/></Link></a> {/* i delete src={logo}*/}
                </li>
                <li>
                    <a href="/yourpost" className="options"><Link to="/yourpost">Your Post</Link></a>
                </li>
                <li>
                    <a href="/likedpost" className="options"><Link to="/likedpost">Liked Post</Link></a>
                </li>
                <li>
                    <a href="/draft" className="options"><Link to="/draft">Confession Draft</Link></a>
                </li>
                <li>
                    <a className="options" onClick={openModal}>Make Confession</a>
                </li>
                <li>
                    <a className="logoutOption" onClick={openMenu}>
                        Profile
                        {ShowMenu === true && <div>
                            <div className="customModal2">
                                <div className="menuDiv">
                                    <a href="#" className="menuOptions1" onClick={() => SetCPwModal(true)}>Change Password</a>    
                                    <a href="/" className="menuOptions2" onClick={logout}>Logout</a>  
                                    {role === "admin" && <a href="/admin/tags" className="menuOption3"><Link to="/admin/tags">Edit Tags</Link></a>}
                                    {role === "admin" && <a href="/admin/page" className="menuOption3"><Link to="/admin/page">Admin Page</Link></a>}                      
                                </div>
                                </div>
                            </div>}   
                    </a>
                </li>
            {ModalStatus === true && <div>
                <Modal open={true} onClose={closeModal} classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}>
                    <CreateConfession/>
                </Modal>
            </div>}
            {CPwModal === true && <div>
                <Modal open={true} onClose={() => SetCPwModal(false)} classNames={{
                    overlay: 'customOverlay',
                    modal: 'customModal',
                }}>
                    <ChangePassword/>
                </Modal>
            </div>}
            </nav>
        </div>
    )
}
