import React, { Component } from 'react'
import { Tooltip, Form, Button, Input, Comment } from 'antd'
import { UserOutlined, FileUnknownOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import Spinner from '../UI/Spinner'

import './AudioPage.css'


const Editor = ({ onSubmit, submitting }) => {
    
    const [commentForm] = Form.useForm();
    
    return (
    <>
        <Form form={commentForm} onFinish={onSubmit}>
            <Form.Item name="content">
                <Input.TextArea rows={4} placeholder="Your comment..."/>
            </Form.Item>
            <Form.Item>
                <Button loading={submitting} htmlType="submit">
                    Add Comment
                </Button>
            </Form.Item>
        </Form>
    </>
);
}


const AudioPage = (props) => {

    const api_url = 'http://localhost:3002/'

    const [audioId, setAudioId] = useState('')
    const [songInfo, setSongInfo] = useState({})
    const [loadingSongData, setLoadingSongData] = useState(true)
    const [submittingComment, setSubmittingComment] = useState(false)

    const getSongById = () => {
        const id = props.match.params.id;
        setAudioId(id)
        fetch('http://localhost:3002/audios/audio-info-by-id', {method: 'POST', 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: id})})
        .then(result => {
            console.log(result)
            return result.json();
        })
        .then(result => {
            setSongInfo({...result.audioInfo})
            setLoadingSongData(false)
        })
        .catch(err => {
            console.log(err)
            props.notification('error', 'Error', 'No connection or API server is down. \n Try again later.')
        })
    }

    useEffect(() => {
        getSongById()
    }, [])

    useEffect(() => {
        console.log(songInfo)

    }, [songInfo])

    const likeHandler = () => {

        const userToken = props.getCookie('token')
        console.log(userToken)
        
        if(userToken){
            // setLoadingSongData(true) 

            fetch('http://localhost:3002/audios/add-to-favorites', {method: 'POST', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({audioId: audioId, userToken: userToken})})
            .then(result => {
                console.log(result)
                return result.json();
            })
            .then(result => {
                props.notification(result.status, result.status.charAt(0).toUpperCase() + result.status.slice(1), result.message)
                getSongById()
            })
            .catch(err => {
                console.log(err)
            })
        }
        else{
            props.notification('info', 'Info', 'You have to log in to add audios to favorites')
        }
    }

    const onCommentSubmit = (values) => {

        const userToken = props.getCookie('token')

        if(userToken){
            setSubmittingComment(true)

            const audioFormData = {audioId: audioId, userToken: userToken, content: values.content}
            
            fetch(api_url + 'audios/add-comment', {
                method: 'POST',
                body: JSON.stringify(audioFormData),
                headers: {"Content-Type": "application/json"}
            })
            .then(result => result.json())
            .then(result => {
                console.log(result)
                props.notification(result.status, result.status.charAt(0).toUpperCase() + result.status.slice(1), result.message)
                setSubmittingComment(false)
                setTimeout(() => window.location.reload(), 500)
            })
            .catch(err => console.log(err))
        }
        else{
            props.notification('warning', 'Warning', 'You have to log in to add comments to audios')
        }
        
      
    }

    const trackSingers = () => {
        let trackSingers = loadingSongData ? '' : songInfo.singers.map(el => {
            return el.name }).join(', ')
        console.log(trackSingers)
        return trackSingers
    }

    const dateToPrettyFormat = (dateInMillliseconds) => {
        const date = new Date(dateInMillliseconds);
        return date.getDate() + "/"  + date.getMonth();
    }

    return (
        loadingSongData 
        ? <Spinner /> 
        : 
        <div className='audio-page-wrapper'>
        <div className='audio-info-wrapper' style={{backgroundImage: `url(${'http://localhost:3002/' + songInfo.imagePath})`, backgroundSize: 'cover'}}>
            <div className='audio-info'>
                <div className='audio-title'> 
                    {songInfo.title}
                </div>
                <div className='audio-singer'> 
                    by {trackSingers()}
                </div>
            </div>
            <Tooltip title="Add to favorites">
                <button className='audio-liked' onClick={likeHandler}> 
                    <img className="audio-page-helper-icons" src="/images/like.svg" alt="Like" /> 
                    <div className='audio-like-amount'> 
                        {songInfo.likesCount}
                    </div>
                </button>
            </Tooltip>
            <div className='audio-number-of-plays'> 
                <img className="audio-page-helper-icons" src="/images/listen-count.svg" alt="listen count"/>
                <span>{songInfo.numberOfPlays}</span>
            </div>
        </div>
        {/* <hr/> */}
        <div className='audio-bio-comments-wrapper'>
            {/* <div className='audio-other-audios'>
                <img className="audio-page-helper-icons" src="/images/other-audios.svg" alt="" />
                Other singer audios 
            </div> */}
                <div className='audio-comments-section'>
                    <img className="audio-page-helper-icons" src="/images/comments.svg" alt="comments"/>
                    <span>Comments</span>
                    <hr/>
                        {/* <input id="comment" placeholder='Leave your comment'/> */}
                        <Editor onSubmit={onCommentSubmit} submitting={submittingComment}/>
                        {songInfo.comments.length >= 1 ? songInfo.comments.map(el => <Comment style={{"color": "black"}} key={el._id} author={<Tooltip title={el.from.email}>{el.from.email}</Tooltip>} avatar={<UserOutlined/>} content={el.content} datetime={<Tooltip title={dateToPrettyFormat(el.timedate)}>{dateToPrettyFormat(el.timedate)}</Tooltip>}></Comment>) :
                         <>
                            <FileUnknownOutlined style={{"fontSize": "50px"}}/>
                            <p>No comments yet</p>
                        </> }
                </div>
            </div> 
        </div>
    )
    }
export default AudioPage