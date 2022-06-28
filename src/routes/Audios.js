import React, { useEffect } from 'react';
import audioList from '../components/audioList'
import AudioFooter from '../components/audio/AudioFooter';
// import playButton from '../images/play-button.svg'

// style={{"position": "relative", "right": "20%"}}

const Audio = (props) => {

    useEffect(() => {
      console.log(props.history)
    })

    

    const trackDuration = (sec) => {
    let minutes = parseInt((sec / 60), 10);
    let remainingSeconds = sec - (minutes * 60);
    return `${minutes}:${remainingSeconds < 9 ? remainingSeconds = `0${remainingSeconds}` : remainingSeconds}`
}

  const toAudioPageHandler = (id) => {
    props.history.push( props.history.location.pathname + '/' + id)
  }

  return (
      <div className="container">
        <div className="audio-item-wrapper">
        {audioList.map((el, index) => {
          return (
                <div className="audio-item" key={el.title} onClick={() => toAudioPageHandler(el.id)}>
                  <div className="grid-play">
                    <img src="/images/play-button.svg" alt="play"/>
                  </div>
                  <div className="grid-album-cover">
                    <img src={el.imagePath} alt="albumCover"/>
                  </div>
                  <div className="grid-singer">{el.singer}</div>
                  <div className="grid-title">{el.title}</div>
                  <span className="grid-audio-item-duration">{trackDuration(el.duration)}</span>
              </div>
          )
        })}
      </div>
      <AudioFooter>
    
      </AudioFooter>
      </div>     
    )
  }


export default Audio;
