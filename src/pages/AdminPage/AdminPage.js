import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table'
import parse from 'html-react-parser';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import "./AdminPage.css"
import 'react-notifications/lib/notifications.css';
import troll from '../../images/pentol.png';

export default function AdminPage() {
    const history = useHistory();

    const [role, GetUserRole] = useState('')

    const [userdata, GetUserData] = useState([])
    const [tagdata, GetTagData] = useState([])
    const [likedata, GetLikeData] = useState([])
    const [confessiondata, GetConfessionData] = useState([])
    const [commentdata, GetCommentData] = useState([])
    const [replydata, GetReplyData] = useState([])

    const [OTStatus, SetOTStatus] = useState('') // Open Table

    const usertable = () => {
        Axios.post("https://conhut.herokuapp.com/admin/seetable", {
            table: "user"
        }).then((result) => {
            GetUserData(result.data)
            SetOTStatus("user")
        })
    }
    const tagtable = () => {
        Axios.post("https://conhut.herokuapp.com/admin/seetable", {
            table: "tags"
        }).then((result) => {
            GetTagData(result.data)
            SetOTStatus("tags")
        })
    }
    const likestable = () => {
        Axios.post("https://conhut.herokuapp.com/admin/seetable", {
            table: "likes"
        }).then((result) => {
            GetLikeData(result.data)
            SetOTStatus("likes")
        })
    }
    const confessiontable = () => {
        Axios.post("https://conhut.herokuapp.com/admin/seetable", {
            table: "confession"
        }).then((result) => {
            GetConfessionData(result.data)
            SetOTStatus("confession")
        })
    }
    const commenttable = () => {
        Axios.post("https://conhut.herokuapp.com/admin/seetable", {
            table: "comments"
        }).then((result) => {
            GetCommentData(result.data)
            SetOTStatus("comments")
        })
    }
    const repliestable = () => {
        Axios.post("https://conhut.herokuapp.com/admin/seetable", {
            table: "commentcomment"
        }).then((result) => {
            GetReplyData(result.data)
            SetOTStatus("replies")
        })
    }

    const backToHome = () => {
        history.push("/home");
    }

    const downloadcsv = () => {
        Axios.post("https://conhut.herokuapp.com/admin/download/csv", {
            table: OTStatus
        }).then((response) => {
            if (response.data.dstatus === true) {
                NotificationManager.success('Download Completed!', 'Success');
            }
        })
    }

    useEffect(() => {
        Axios.get("https://conhut.herokuapp.com/getaccount").then((result) => {
            if (result.data.user !== undefined) {
                if (result.data.user[0].usertype === "admin") {
                    GetUserRole(result.data.user[0].usertype)
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
        <div className="admin-page">
            {role === "admin" && <div className="adminAlign">
                {/*<NavBar/>*/}
                <div className="adminRow">
                    <button className="backButton" onClick={backToHome}>Home</button>
                    <img className="pentol" src={troll}></img>
                    <h1>All User</h1>
                    <img className="pentol" src={troll}></img>
                </div>
                <div className="tableRow">
                    <button className="all-table-btn" onClick={commenttable}>Comment Table</button>
                    <button className="all-table-btn" onClick={repliestable}>Comment Replies Table</button>
                    <button className="all-table-btn" onClick={confessiontable}>Confession Table</button>
                    <button className="all-table-btn" onClick={likestable}>Likes Table</button>
                    <button className="all-table-btn" onClick={tagtable}>Tags Table</button>
                    <button className="all-table-btn" onClick={usertable}>User Table</button>
                </div>
                {OTStatus === "user" && <div className="user-table-display">
                    <Table responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>AnonTag</th>
                            <th>DOB</th>
                            <th>UserType</th>
                            <th>Join Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userdata.map((val) => {
                            return (
                                <>
                                <br/>
                                <tr>
                                    <th>{val.id}</th>
                                    <th>{val.email}</th>
                                    <th>{val.anontag}</th>
                                    <th>{val.DOB}</th>
                                    <th>{val.usertype}</th>
                                    <th>{val.joindate}</th>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                    </Table>
                    <div className="download-csv-button">
                        <button class="dcsv-btn" onClick={downloadcsv}>Download csv</button>
                    </div>
                </div>}
                {OTStatus === "tags" && <div className="tags-table-display">
                    <Table responsive>
                    <thead>
                        <tr>
                            <th>Tag ID</th>
                            <th>Tag</th>
                            <th>Tag Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tagdata.map((val) => {
                            return (
                                <>
                                <hr/>
                                <tr>
                                    <th>{val.tag_id}</th>
                                    <th>{val.tag}</th>
                                    <th>{val.tagcount}</th>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                    </Table>
                    <div className="download-csv-button">
                        <button class="dcsv-btn" onClick={downloadcsv}>Download csv</button>
                    </div>
                </div>}
                {OTStatus === "likes" && <div className="like-table-display">
                    <Table responsive>
                    <thead>
                        <tr>
                            <th>Like ID</th>
                            <th>Confess ID</th>
                            <th>Like Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {likedata.map((val) => {
                            return (
                                <>
                                <hr/>
                                <tr>
                                    <th>{val.like_id}</th>
                                    <th>{val.confess_id}</th>
                                    <th>{val.like_owner}</th>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                    </Table>
                    <div className="download-csv-button">
                        <button class="dcsv-btn" onClick={downloadcsv}>Download csv</button>
                    </div>
                </div>}
                {OTStatus === "confession" && <div className="confession-table-display">
                    <Table responsive>
                    <thead>
                        <tr>
                            <th>Confess ID</th>
                            <th>Confess Owner</th>
                            <th>Confess Location</th>
                            <th>Confess Title</th>
                            <th>Confess Content</th>
                            <th>Confess Tag</th>
                            <th>Date Created</th>
                            <th>Date Published</th>
                            <th>Draft Status</th>
                            <th>Timer</th>
                            <th>Likes</th>
                            <th>Comments Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {confessiondata.map((val) => {
                            return (
                                <>
                                <hr/>
                                <tr>
                                    <th>{val.confess_id}</th>
                                    <th>{val.confess_owner}</th>
                                    <th>{val.confess_location}</th>
                                    <th>{val.confess_title}</th>
                                    <th>{parse(val.confess_content)}</th>
                                    <th>{val.confess_tag}</th>
                                    <th>{val.date_created}</th>
                                    <th>{val.date_published}</th>
                                    <th>{val.draft}</th>
                                    <th>{val.timer}</th>
                                    <th>{val.likes}</th>
                                    <th>{val.comnum}</th>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                    </Table>
                    <div className="download-csv-button">
                        <button class="dcsv-btn" onClick={downloadcsv}>Download csv</button>
                    </div>
                </div>}
                {OTStatus === "comments" && <div className="comment-table-display">
                    <Table responsive>
                    <thead>
                        <tr>
                            <th>Comment ID</th>
                            <th>Confess ID</th>
                            <th>Comment</th>
                            <th>Reply Count</th>
                            <th>Comment Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commentdata.map((val) => {
                            return (
                                <>
                                <hr/>
                                <tr>
                                    <th>{val.comment_id}</th>
                                    <th>{val.confess_id}</th>
                                    <th>{parse(val.comment_content)}</th>
                                    <th>{val.replycount}</th>
                                    <th>{val.comment_owner}</th>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                    </Table>
                    <div className="download-csv-button">
                        <button class="dcsv-btn" onClick={downloadcsv}>Download csv</button>
                    </div>
                </div>}
                {OTStatus === "replies" && <div className="replies-table-display">
                    <Table responsive>
                    <thead>
                        <tr>
                            <th>Reply ID</th>
                            <th>Comment ID</th>
                            <th>Comment</th>
                            <th>Comment Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {replydata.map((val) => {
                            return (
                                <>
                                <hr/>
                                <tr>
                                    <th>{val.cc_id}</th>
                                    <th>{val.comment_id}</th>
                                    <th>{parse(val.comment)}</th>
                                    <th>{val.comment_owner}</th>
                                </tr>
                                </>
                            )
                        })}
                    </tbody>
                    </Table>
                    <div className="download-csv-button">
                        <button class="dcsv-btn" onClick={downloadcsv}>Download csv</button>
                    </div>
                </div>}
            </div>}
            <NotificationContainer/>
        </div>
    )
}