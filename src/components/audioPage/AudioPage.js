import React, { Component } from 'react'
import audioList from '../audioList'
import './AudioPage.css'
import Spinner from '../UI/Spinner'

class AudioPage extends Component {

    state = {
        songInfo: {},
        loadingSongData: true
    }
    
    getSongById = () => {
        const id = this.props.match.params.id;
        const songInfo = audioList.find(el => el.id == id)

        this.setState({songInfo: songInfo}, () => {
            this.setState({loadingSongData: false})
        })
        
    }

    componentDidMount() {
            this.getSongById();
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

    componentDidUpdate(prevState){

    }

//     componentDidUpdate(){
//             console.log(this.state.songInfo.comments)
//             if(this.state.songInfo.comments){
//                 this.setState((state) => {
//                     return {loadingSongData: !state.loadingSongData}
//             })   
//     }
// }

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
                <form>
                    <textarea name="comment" id="comment" rows="5"></textarea>
                </form>
                Comments:
                {this.state.loadingSongData ? <Spinner/> : this.state.songInfo.comments.map(el => {
                    return (
                        <div key={el.id}>{el.comment}</div>
                    )
                })}
            </div>
            {this.props.match.params.id}
        </div>
        )
    }
}

export default AudioPage