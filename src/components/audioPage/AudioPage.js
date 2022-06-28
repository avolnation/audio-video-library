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
        const songInfo = audioList.find(el => el.id == id)

        this.setState({songInfo: songInfo}, () => {
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
        e.preventDefault();
        const songInfo = this.state.songInfo;

        console.log(songInfo.comments)

        songInfo.comments.push({id: Math.random(), fromId: Math.random(), comment: this.state.comment})

        this.setState({loadingSongData: true}, () => {
            this.setState({songInfo: songInfo}, () => {
                this.setState({loadingSongData: false})
            })
        })
    }

    render() {
        return (
        <div className='audio-page-wrapper'>
            <div className='audio-page-album-icon'>
                <img src="/images/album-icon.svg" alt="Album" />
            </div>
            <div className='audio-title'> {this.state.songInfo.title}</div>
            <div className='audio-singer'> {this.state.songInfo.singer}</div>
            <button className='audio-liked' onClick={this.likeHandler}> 
                <img src="/images/thumbs-up.svg" alt="Like" /> 
                <div className='audio-like-amount'> {this.state.songInfo.likesCount}</div>
            </button>
                <div className='audio-number-of-plays'> Played {this.state.songInfo.numberOfPlays} times</div>
            <div className='audio-comments-section'>
                Add Your Comment
                <form onSubmit={(e) => this.addCommentHandler(e)}>
                    <textarea name="comment" id="comment" rows="5" onChange={(event) => this.commentChange(event)} value={this.state.comment}></textarea>
                    <button>submit</button>
                </form>
                Comments:
                {this.state.loadingSongData ? <Spinner/> : this.state.songInfo.comments.map(el => {
                    return (
                        <div key={el.id}>{el.comment}</div>
                    )
                })}
            </div>
        </div>
        )
    }
}

export default AudioPage