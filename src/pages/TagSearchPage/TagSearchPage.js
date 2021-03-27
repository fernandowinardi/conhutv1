import React, {useEffect, useState} from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

import Modal from "react-responsive-modal";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import parse from 'html-react-parser';

import "./TagSearchPage.css"

export default function TagSearchPage() {
    const history = useHistory();

    const [TagContentList, GetTagContentList] = useState([])
    const [CurrentTag, GetCurrentTag] = useState('')

    const [CommentMode, SetCommentMode] = useState(false)
    const [CCMode, SetCCMode] = useState(false) // comment comment
    const [confirmationMode, SetConfirmation] = useState(false)
    const [CommentList, GetCommentList] = useState([])
    const [comment, GetComment] = useState("")
    const [CC, GetCC] = useState("")
    const [CCList, GetCCList] = useState([])
    const [CCcontent, SetCCcontent] = useState("")
    const [CCowner, SetCCowner] = useState("")
    const [CCID, SetCCID] = useState(0)
    const [LikedList, GetLikedList] = useState([])
    const [usertag, GetUserTag] = useState("")
    const [usertype, GetUserType] = useState("")

    const editorConfiguration = {
        placeholder: "Type your comment here...",
        toolbar: ["bold", "italic", "underline"]
    }

    const likeConfession = (conID) => {
        Axios.post("https://conhut.herokuapp.com/confession/like", {
            confessid: conID
        })
        window.location.reload(); // remove this if want to use useeffect that remove , [] (testing)
    }

    const openConfirmation = () => {
        SetConfirmation(true)
    }

    const closeConfirmation = () => {
        SetConfirmation(false)
    }

    const getComment = (con_ID) => {
        SetCommentMode(true)
        console.log(con_ID)
        Axios.post("https://conhut.herokuapp.com/confession/comment/get", {
            confessid: con_ID
        }).then((response) => {
            GetCommentList(response.data)
        })
    }

    const postcomment = () => {
        if (comment !== "") {
            Axios.post("https://conhut.herokuapp.com/confession/comment/post", {
                content: comment
            }).then((response) => {
                if (response.data.message) {
                    GetComment("")
                    SetCommentMode(false)
                    window.location.reload();
                }
            })
        }
    }

    const closemodal = () => {
        SetCommentMode(false)
        SetCCMode(false)
    }

    const clicktag = (tag) => {
        Axios.post("https://conhut.herokuapp.com/tag/store", {
            clicktag: tag
        })
        history.push(`/search/${tag}`)
        window.location.reload();
    }

    const deleteconfession = (conID) => {
        Axios.delete(`https://conhut.herokuapp.com/confession/delete/${conID}`)
        window.location.reload();
    }

    const commentcomment = (comID, content, owner) => {
        SetCCMode(true);
        SetCCowner(owner)
        SetCCcontent(content)
        SetCCID(comID)
        Axios.post("https://conhut.herokuapp.com/confession/comment/comment/get", {
            commentID: comID
        }).then((response) => {
            if (response.data) {
                GetCCList(response.data)
            }
        })
    }

    const postcc = () => {
        if (CC !== "") {
            Axios.post("https://conhut.herokuapp.com/confession/comment/comment/post", {
                content: CC,
                commentID: CCID
            }).then((response) => {
                if (response.data.message) {
                    GetCC("")
                    closemodal()
                    window.location.reload();
                }
            })
        }
    }

    useEffect(() => {
        Axios.get("https://conhut.herokuapp.com/getaccount").then((result) => {
            if (result.data.loggedIn === true) {
                GetUserTag(result.data.user[0].anontag)
                GetUserType(result.data.user[0].usertype)
                Axios.get("https://conhut.herokuapp.com/tag/search").then((response) => {
                    GetTagContentList(response.data.tr)
                    GetCurrentTag(response.data.curtag)
                })
                Axios.get("https://conhut.herokuapp.com/confession/likes/compare").then((result) => {
                    if (result.data) {
                        GetLikedList(result.data[0].liked_confession)
                    }
                })
            }
            else {
                history.push("/")
            }
        });
    }, []); // remove the , [] later on 
    
    return (
        <div className="tag-search-page">
        <div className="navBarDiv">
            <NavBar/>
        </div>
        <div className="homeHeader">
            <h1 className="header">{CurrentTag} confessions</h1>
        </div>
        <div className="homepageContainer">
            {TagContentList.map((val) => {
                return (
                    <>
                        <div className="displayCard">
                            <div className="confessOwner">
                                <label className="owner">Confessed by: <b>{val.confess_owner}</b></label>
                            </div>

                            <div className="confessLocation">
                                <label>Happened at: <a className="location">{val.confess_location}</a></label>                               
                            </div>

                            <div className="confessTime">
                                Posted at: {val.date_published.substring(0,10)}
                            </div>

                            <div className="confessTitle">
                                <label className="title">{val.confess_title} </label>
                                
                            </div>
                            
                            <div className="confessContent">
                                <p>{parse(val.confess_content)}</p>
                            </div>

                            <div className="like-area">
                                {LikedList.includes(val.confess_id) === false && <i className="fa fa-heart liked" onClick={() => likeConfession(val.confess_id)}> </i>}
                                {LikedList.includes(val.confess_id) === true && <i className="fa fa-heart unliked" onClick={() => likeConfession(val.confess_id)}> </i>}
                                <label> {val.likes}</label>
                            </div>

                            <div className="comment-area">
                                <i className="fa fa-comment" onClick={() => getComment(val.confess_id)}></i>
                                <label> {val.comnum}</label>
                            </div>

                            <div className="block1"></div>

                            <div className="confessTags">
                                <label>Tags: </label>
                                {val.confess_tag.map((value) => {
                                    return(
                                        <button className="tag-btn" onClick={() => clicktag(value)}>{value}</button>
                                    )
                                })}
                            </div>

                            {((usertag === val.confess_owner) === true || usertype === "admin")&& <i className="fa fa-trash" onClick={openConfirmation}> Delete</i>}
                            {confirmationMode === true && <div>
                                <Modal open={true} onClose={closeConfirmation} showCloseIcon={false} classNames={{
                                    overlay: 'customOverlay',
                                    modal: 'customModal'
                                }}>
                                    <div className="deleteContainer">
                                        <p>Are you sure you want to delete your confession?</p>
                                        <button className="deleteBtn" onClick={() => deleteconfession(val.confess_id)}>Delete</button>
                                        <button className="deleteCancelBtn" onClick={closeConfirmation}>Cancel</button>
                                    </div>
                                    
                                </Modal>

                                </div>} 

                            {CommentMode === true && <div>
                                <Modal open={true} onClose={closemodal} showCloseIcon={false}classNames={{
                                    overlay: 'customOverlay3',
                                    modal: 'customModal3',
                                }}>
                                    <CKEditor
                                        editor = { Editor }
                                        data = ""
                                        config = {editorConfiguration}
                                        onChange = {(event, editor) => {
                                            const data = editor.getData()
                                            GetComment(data);
                                        }}                       
                                    />
                                    <button className="commentBtn" onClick={postcomment}>Enter</button> 
                                    <div className="all-comments">
                                        <h3>Comments:</h3>
                                        {CommentList.map((value) => {
                                            return (
                                                <>
                                                    <div>
                                                        <label className="commentOwner">{value.comment_owner} said:</label>
                                                        <a onClick={() => commentcomment(value.comment_id, value.comment_content, value.comment_owner)}>Reply...  ({value.replycount})</a>
                                                    </div>
                                                    <p className="commentContent">{parse(value.comment_content)}</p>
                                                    <hr></hr>
                                                </>
                                            )
                                        })}
                                    </div>
                                </Modal>
                            </div>}
                            {CCMode === true && <div>
                                <Modal open={true} onClose={closemodal}>
                                    <div>
                                        <label className="commentOwner">Replying to <u>{CCowner}'s</u> comment:</label>
                                        <p className="commentContent">{parse(CCcontent)}</p>
                                        <hr></hr>
                                    </div>
                                    <div>
                                        <CKEditor
                                            editor = { Editor }
                                            data = ""
                                            config = {editorConfiguration}
                                            onChange = {(event, editor) => {
                                                const data = editor.getData()
                                                GetCC(data);
                                            }}    
                                        />
                                        <button className="commentBtn" onClick={postcc}>Enter</button>
                                    </div>
                                    <div className="all-replies">
                                        <h3>Replies:</h3>
                                        {CCList.map((value) => {
                                            return (
                                                <>
                                                <div>
                                                    <label className="commentOwner"><u>{value.comment_owner}</u> comment:</label>
                                                    <p className="commentContent">{parse(value.comment)}</p>
                                                    <hr></hr>
                                                </div>
                                                </>
                                            )
                                        })}
                                    </div>
                                </Modal>
                            </div>}
                        </div>
                        </>
                )
            })}
        </div>
    </div>
    )
}