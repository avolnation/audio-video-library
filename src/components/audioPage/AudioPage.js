import React, { Component } from 'react'
import audioList from '../audioList'
import './AudioPage.css'
import Spinner from '../UI/Spinner'

class AudioPage extends Component {

    state = {
        songInfo: {},
        loadingSongData: true,
        comment: ''
    }

    componentDidMount() {
        this.getSongById();
    }
    
    getSongById = () => {
        const id = this.props.match.params.id;
        fetch('http://localhost:3002/audios/audio-info-by-id', {method: 'POST', 
        body: id})
        .then(result => {
            console.log(result)
            return result.json();
        })
        .then(result => {
            this.setState({songInfo: result.audioInfo[0]})
            this.setState({loadingSongData: false})
        })
        .catch(err => {
            console.log(err)
            this.setState({loadingSongData: false})
        })
    }

    likeHandler = () => {
        const songInfo = this.state.songInfo;

        songInfo.likesCount += 1;

        console.log(songInfo)

        const newSongInfo = songInfo

        this.setState({loadingSongData: true}, () => {
            this.setState({songInfo: newSongInfo}, () => {
                this.setState({loadingSongData: false})
            })
        })
        
    }

    commentChange = (event) => {

        const lastCommentState = event.target.value

        this.setState({comment: lastCommentState})
        
    }

    addCommentHandler = (e) => {
        if(e.key === "Enter"){
            const songInfo = this.state.songInfo;
    
            console.log(songInfo.comments)
    
            songInfo.comments.push({id: Math.random(), fromId: Math.random(), comment: this.state.comment})
    
            this.setState({loadingSongData: true}, () => {
                this.setState({songInfo: songInfo}, () => {
                    this.setState({loadingSongData: false})
                })
            })
        }
    }

    trackSingers = () => {
        let songInfo = this.state.songInfo;
        let trackSingers = songInfo.singers.map(el => {
            return el.name }).join(', ')
        return trackSingers
    }

    render() {

        return (
            this.state.loadingSongData ? <Spinner /> : 
        <div className='audio-page-wrapper'>
            <div 
                className='audio-info-wrapper' 
                style={{backgroundImage: `url(${'http://localhost:3002/' + this.state.songInfo.imagePath})`, 
                        backgroundSize: 'cover'}}>
                {/* <div className='audio-page-album-icon'>
                    <img src={this.state.songInfo.imagePath} alt="Album" />
                </div> */}
                <div className='audio-info'>
                    <div className='audio-title'> 
                        {this.state.songInfo.title}
                    </div>
                    <div className='audio-singer'> 
                        by {this.trackSingers()}
                    </div>
                </div>
                <button className='audio-liked' onClick={this.likeHandler}> 
                    <img className="audio-page-helper-icons" src="/images/like.svg" alt="Like" /> 
                    <div className='audio-like-amount'> 
                        {this.state.songInfo.likesCount}
                    </div>
                    </button>  
                <div className='audio-number-of-plays'> 
                    <img className="audio-page-helper-icons" src="/images/listen-count.svg" alt="listen count"/>
                    <span>{this.state.songInfo.numberOfPlays}</span>
                </div>
            </div>
            <hr/>
            <div className='audio-bio-comments-wrapper'>
                <div className='audio-other-audios'>
                    <img className="audio-page-helper-icons" src="/images/other-audios.svg" alt="" />
                    Other singer audios 
                </div>
                    <div className='audio-comments-section'>
                        <img className="audio-page-helper-icons" src="/images/comments.svg" alt="comments"/>
                        <span>Comments</span>
                        <hr/>
                            <input onChange={(event) => this.commentChange(event)} onKeyUp={(e) => this.addCommentHandler(e)} id="comment" placeholder='Leave your comment'/>
                        {/* {this.state.loadingSongData ? <Spinner/> : this.state.songInfo.comments.map(el => {
                            return (
                                <div className='audio-comments-section-comment' key={el.id}>
                                    <img className='audio-comments-section-comment-user-icon' src="https://bootdey.com/img/Content/user_1.jpg" alt="" />
                                    <div>
                                        
                                        <div>from Jeff Bezos <span className='audio-comment-comment-time'> day ago </span></div>
                                        <div>{el.comment}</div>
                                    </div>
                                    </div>
                            )
                        })} */}
                    </div>
                </div> 
            
        </div>
        )
    }
}

export default AudioPage