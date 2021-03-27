import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { useHistory } from "react-router-dom"

import TimerOption from '../../GlobalVar/TimerOption';
import './CreateConfession.css'

// create confession
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Select from 'react-select';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

export default function CreateConfession() {
    const history = useHistory();

    const [title, GetTitle] = useState('')
    const [content, GetContent] = useState('')
    const [location, GetLocation] = useState('')
    const [timer, GetTimer] = useState('0')
    const [Tag, GetTag] = useState([])
    const [TagOption, GetTagOption] = useState([])

    const [publishSuc, SetPubSuc] = useState(false) // publish or save to draft success
    const [PublishStatus, GetPublishStatus] = useState('')

    const editorConfiguration = {
        placeholder: "Type your confession here...",
        toolbar: ["bold", "italic", "underline"]
    }

    const postConfession = (draft) => {
        let usertimer = 0
        var tagarray = []
        if (draft === 0) {
            if (timer.value !== undefined) {
                usertimer = timer.value
            }

            for (var i = 0; i < Tag.length; i++) {
                delete Tag[i].label
                tagarray.push(Tag[i].value)
            } 

            if (location === "" || content === "" || title === "" || usertimer === 0 || tagarray.length === 0) {
                GetPublishStatus("We cannot publish your confession while some of the field is empty!")
                return
            } 

        } else if (draft === 1) {
            if (title === "") {
                GetPublishStatus("Add a title before saving to draft!")
                return
            }
        } 

        Axios.post("https://conhut.herokuapp.com/confession/create", {
            location: location,
            content: content,
            title: title,
            timer: usertimer,
            tag: tagarray,
            draft: draft,
        }).then((response) => {
            GetPublishStatus(response.data.message)
            SetPubSuc(true)
        })
    }

    useEffect(() => {
        Axios.get("https://conhut.herokuapp.com/tagoption/get").then((response) => {
            if (response.data) {
                GetTagOption(response.data)
            }
        })
    }, [])

    return (
        <div className="createConfession">
            {publishSuc === true && <div>
                <p>{PublishStatus}</p>
            </div>}
            {publishSuc === false && <div>
                <div>
                    <label className="label"> Title:
                        <input 
                        className = "TitleField"
                        maxLength = "250"
                        placeholder="Spice your confession!"
                        onChange={(e) => {
                            GetTitle(e.target.value);
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
                        GetContent(data);
                    }}                       
                />
            </div>
            <div className="block1"></div>
            <div>
                <label className="label"> Crime scene:
                    <input
                    className = "LocationField" 
                    maxLength = "150"
                    placeholder="Where did it take place?"
                    onChange={(event) => {
                        GetLocation(event.target.value);
                    }}
                    />
                </label>
            </div>
            <div className="block1"></div>
            <Select
                className = "SelectField"
                defaultValue = {timer}
                onChange = {GetTimer}
                options = {TimerOption}/>
            <div className="block2"></div>
            <Select
                className = "SelectField"
                defaultValue = {Tag}
                onChange = {GetTag}
                isMulti
                options = {TagOption}/>
            <div className="block1"></div>
            <div className="buttons">
                <button className="DraftBtn" onClick={() => {postConfession(1)}}>Save to Draft</button>
                <button className="PublishBtn" onClick={() => {postConfession(0)}}>Publish</button>
            </div>
            <p>{PublishStatus}</p>
        </div>}
    </div>
    )
}