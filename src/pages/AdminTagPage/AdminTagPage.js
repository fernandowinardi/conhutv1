import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import troll from '../../images/pentol.png';

import "./AdminTagPage.css"

export default function AdminTagPage() {
    const history = useHistory();

    const [role, GetUserRole] = useState('')
    const [tagname, GetTagName] = useState('')
    const [taglist, GetTagList] = useState([])

    const addTag = () => {
        Axios.post("https://conhut.herokuapp.com/admin/tag/create", {
            tagname: tagname
        })
        window.location.reload();
    }

    const TagLink = (tag) => {
        Axios.post("https://conhut.herokuapp.com/tag/store", {
            clicktag: tag
        })
        history.push(`/search/${tag}`)
    }

    const DeleteTag = (tagid) => {
        Axios.delete(`https://conhut.herokuapp.com/admin/tag/delete/${tagid}`,)
        window.location.reload();
    }

    const backToHome = () => {
        history.push('/home');
    }

    useEffect(() => {
        Axios.get("https://conhut.herokuapp.com/getaccount").then((result) => {
            if (result.data.user !== undefined) {
                if (result.data.user[0].usertype === "admin") {
                    GetUserRole(result.data.user[0].usertype)
                    Axios.get("https://conhut.herokuapp.com/tag/get").then((response) => {
                        GetTagList(response.data)
                    })
                }
                else {
                    history.push("/")
                }
            } else {
                history.push("/")
            }
        });
    }, []); // remove the , [] later on 
    
    return (
        <div className="admin-tag-page">
            {role === "admin" && <div className="adminAlign">
                {/*<NavBar/>*/}
                <div className="adminRow">
                <button className="backButton" onClick={backToHome}>Home</button>
                    <img className="pentol" src={troll}></img>
                    <h1>ALL TAGS</h1>
                    <img className="pentol" src={troll}></img>
                </div>
                <div className="list-tags">
                    <div className="add-tags">
                        <input placeholder="Add tags..." onChange={(e) => {GetTagName(e.target.value)}}></input>
                        <button className="addButton" onClick={addTag}>Add</button>
                    </div>
                    {taglist.map((val) => {
                        return (
                        <>
                            <div className="tag-row">
                                <label className="countLabel">Count: {val.tagcount}</label><button className="focusTag" onClick={() => TagLink(val.tag)}>View <b>{val.tag}</b> Confessions</button><button className="deleteTag" onClick={() => DeleteTag(val.tag_id)}>Delete</button>
                            </div>
                        </>
                        )
                    })}
                </div>
                
            </div>}
        </div>
    )
}