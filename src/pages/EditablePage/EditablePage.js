import {React, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import Modal from "react-responsive-modal";
import Select from 'react-select';

// import NavBar 
import NavBar from "../../components/NavBar/NavBar";

import "./EditablePage.css"

export default function EditablePage(){
    const history = useHistory();

    const [openDraft, GotDraft] = useState(false);
    const [publishstatus, GetPublishStatus] = useState('');
    const [draftList, GetDraftList] = useState([]);
    const [publishSuc, SetPubSuc] = useState(false)

    const [location, SetLocation] = useState('');
    const [title, SetTitle] = useState('');
    const [content, SetContent] = useState('');
    const [timer, SetTimer] = useState('0');
    const [Tag, SetTag] = useState([]);
    const [modalStatus, GetModalStatus] = useState(false);
    const [TagOption, GetTagOption] = useState([]);

    const editorConfiguration = {
        placeholder: "Type your confession here...",
        toolbar: ["bold", "italic", "underline"]
    }

    useEffect(() => {
        Axios.get("https://conhut.herokuapp.com/getaccount").then((result) => {
            if (result.data.loggedIn === true) {
                Axios.get("https://conhut.herokuapp.com/confession/getdraft").then((response) => {
                    if (response.data) {
                        GetDraftList(response.data)
                    }
                })
                Axios.get("https://conhut.herokuapp.com/tagoption/get").then((response) => {
                    if (response.data) {
                        GetTagOption(response.data)
                    }
                })
            } else {
                history.push("/")
            }
        });
        if (content !== "") {
            window.addEventListener('beforeunload', alertUser)
            return () => {
                window.removeEventListener('beforeunload', alertUser)
            }
        }
    }, []); // remove the , [] later on 

    const alertUser = (e) => {
        e.preventDefault();
        e.returnValue = ''
    }

    const closemodal = () => {
        GetModalStatus(false)
    }

    const savetoDraft = () => {
        if (title === "") {
            GetPublishStatus("Add a title before saving to draft!")
            GetModalStatus(true)
        } else {
            Axios.post("https://conhut.herokuapp.com/updateconfession/draft", {
            location: location,
            content: content,
            title: title,
            }).then((response) => {
                if (response.data.message) {
                    GetPublishStatus(response.data.message)
                    GetModalStatus(true)
                }
            })
            history.push("/home")
        }
    }

    const publishConfession = () => {
        let usertimer = 0
        var tagarray = []

        if (timer.value !== undefined) {
            usertimer = timer.value
        }

        for (var i = 0; i < Tag.length; i++) {
            delete Tag[i].label
            tagarray.push(Tag[i].value)
        } 

        if (location === "" || content === "" || title === "" || usertimer === 0 || tagarray.length === 0) {
            GetPublishStatus("We cannot publish your confession while some of the field is empty!")
            GetModalStatus(true)
        } else {
            console.log("publish")
            Axios.post("https://conhut.herokuapp.com/updateconfession/publish", {
            location: location,
            content: content,
            title: title,
            timer: usertimer,
            tag: tagarray,
            }).then((response) => {
                if (response.data.message) {
                    GetPublishStatus(response.data.message)
                    GetModalStatus(true)
                }
            })
            history.push("/home")
        }
    }

    const FindDraftID = (conID) => {
        const currentID = `${conID}`
        GotDraft(true)
        Axios.post("https://conhut.herokuapp.com/confession/store/id", {
            confessID: currentID
        })

        Axios.post("https://conhut.herokuapp.com/confession/getdraft/specific", {
            confessID: currentID
        }).then((response) => {
            if (response.data) {
                var array = Object.values(response.data[0])
                console.log(array[4])
                console.log(array)
                SetLocation(array[2])
                SetTitle(array[3])
                if (array[4] !== null) {
                    SetContent(array[4])
                }
            }
        })
    }

    const TimerOption = [
        {value: '12', label: 'Half Day'},
        {value: '24', label: 'One Day'},
        {value: '48', label: 'Two Days'},
        {value: '72', label: 'Three Days'},
        {value: '0', label: 'Permanent'},
    ]

    return (
        <div className="DraftPage">
            <NavBar/>
            <div className="draftContainer">
                 <h2>Your draft</h2>
                    {openDraft === false && <div>
                    {draftList.map((val) => {
                        return (
                            <div className="list-draft-box">
                                <div className="clickable-box" onClick={() => {FindDraftID(val.confess_id)}}>
                                    <a className="draftTitle"><b> Title: </b> {val.confess_title}</a>
                                </div>
                            </div>
                        )
                    })}
                </div>}
                {openDraft === true && <div>
                    <div className="createConfession">
            {publishSuc === true && <div>
                <p>{publishstatus}</p>
            </div>}
            {publishSuc === false && <div>
                <div>
                    <label className="label"> Title:
                        <input 
                        className = "TitleField"
                        value = {title}
                        maxLength = "250"
                        placeholder="Spice your confession!"
                        onChange={(e) => {
                            SetTitle(e.target.value);
                        }}
                        />
                    </label>
                </div>
            <div className="block1"></div>
            <div>
                <CKEditor
                    editor = { Editor }
                    data = {content}
                    config = {editorConfiguration}
                    onChange = {(event, editor) => {
                        const data = editor.getData()
                        SetContent(data);
                    }}                       
                />
            </div>
            <div className="block1"></div>
            <div>
                <label className="label"> Crime scene:
                    <input
                    className = "LocationField" 
                    value = {location}
                    maxLength = "150"
                    placeholder="Where did it take place?"
                    onChange={(event) => {
                        SetLocation(event.target.value);
                    }}
                    />
                </label>
            </div>
            <div className="block1"></div>
            <Select
                className = "SelectField"
                defaultValue = {timer}
                onChange = {SetTimer}
                options = {TimerOption}/>
            <div className="block2"></div>
            <Select
                className = "SelectField"
                defaultValue = {Tag}
                onChange = {SetTag}
                isMulti
                options = {TagOption}/>
            <div className="block1"></div>
            <div className="buttons">
                <button className="DraftBtn" onClick={() => {savetoDraft()}}>Save to Draft</button>
                <button className="PublishBtn" onClick={() => {publishConfession()}}>Publish</button>
            </div>
            <p>{publishstatus}</p>
        </div>}
    </div>
                </div>}
            </div>
           
        </div>
    )
}