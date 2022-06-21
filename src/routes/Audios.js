import React from 'react';
import audioList from '../components/audioList'
// import playButton from '../images/play-button.svg'

// style={{"position": "relative", "right": "20%"}}

const Audio = () => (
  <div className="container">
    <div className="audio-item-wrapper">
    {audioList.map((el, index) => {
      return (
      <div className="audio-item" key={el.title}>
        <div className="grid-play">
          <img  src="/images/play-button.svg" alt="play"/>
        </div>
        <div className="grid-album-cover">
          <img src={el.imagePath} alt="albumCover"/>
        </div>
        <div className="grid-singer">{el.singer}</div>
        <div className="grid-title">{el.title}</div>
        <span className="grid-audio-item-duration">{el.duration}</span>
      </div>
      )
    })}
  </div>
  </div>
  
)

export default Audio;
