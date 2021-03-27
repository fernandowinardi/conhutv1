import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

import "./RSNav.css";

export default function RSNav() {  
    const history = useHistory();

    const [taglist, GetTagList] = useState([])

    const TagLink = (tag) => {
        Axios.post("https://conhut.herokuapp.com/tag/store", {
            clicktag: tag
        })
        history.push(`/search/${tag}`)
    }

    useEffect(() => {
        Axios.get("https://conhut.herokuapp.com/tag/get").then((response) => {
        GetTagList(response.data)
        })
    }, [])

    return ( 
        <div className="right-side-nav">
            <div className="trendingTags">
                <h3>Trending Tags</h3>
                <div className="rs-tag-list">
                    {taglist.map((val) => {
                        return (
                        <>
                        {val.tagcount > 0 && <div className="tagRow" onClick={() => TagLink(val.tag)}> 
                                <hr/>
                                <a className="tagButtons">{val.tag}<br/><label className="numConfession">{val.tagcount} Confessions</label></a>
                            </div>
                        }
                        </>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}