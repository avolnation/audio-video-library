import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';

import audioList from '../components/audioList'

import AudioFooter from '../components/audio/AudioFooter';
import AudioFilters from '../components/audioFilter/audioFilters';


const Audio = (props) => {

    const [genre, setGenre] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listenCountSort, setListenCountSort] = useState(false)

    const trackDuration = (sec) => {
      let minutes = parseInt((sec / 60), 10);
      let remainingSeconds = sec - (minutes * 60);
      return `${minutes}:${remainingSeconds < 9 ? remainingSeconds = `0${remainingSeconds}` : remainingSeconds}`
  }

    let tracks;

    if(!genre){
      tracks = audioList.map((el, index) => {
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
      })
    } else {
      tracks = audioList.filter(e => e.genre === genre).map((el, index) => {
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
                  <span className="grid-audio-item-duration">
                    {trackDuration(el.duration)}
                  </span>
            </div>
        )
      })
      if(tracks.length < 1){
        tracks = (
          <div>
            <img style={{width: '64px', height: '64px'}} src="images/no-data.svg" alt="no data" />
            <span style={{display: 'block'}}> No audios with matching parameters</span>
          </div>

        ) 
      }
    }
    
    useEffect(() => {
      console.log(tracks)
    }, [genre])

    useEffect(() => {
    }, [])

    useEffect(() => {
      console.log(props.history)
    })

    const setGenreForFilter = (el) => {
      setGenre(el.target.id)
    }

  const toAudioPageHandler = (id) => {
    props.history.push( props.history.location.pathname + '/' + id)
  }

  const sortByListenCountHandler = () => {
    setListenCountSort(!listenCountSort)
  }

  let active = 1;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>,
    );
}


  return (
      <div className="container">
        <div className='audio-search-wrapper'>
              <input type="text" placeholder='What song are you searching for?'/>
              <div className='audio-search-sort-by-wrapper'>
                <img style={{width: '24px', height: '24px'}} src="images/sort-by.svg" alt="" />
                <div 
                    className='audio-search-sort-by-item' 
                    onClick={sortByListenCountHandler}> Listen Count 
                    <img 
                      src={listenCountSort ? 'images/sort-down.svg' : 'images/sort-up.svg'} 
                      alt="sort" />
                  </div>
              </div>
        </div>
         <div className="audio-container-wrapper">

          <div style={{marginLeft: '2%'}}>
          <div style={{ margin: '10px'}}>
            <img style={{width: '24px', height: '24px'}} src="images/genres.svg" alt="genres"/>
            <span className='audio-container-wrapper-span'>Genres</span>
          </div>
            <AudioFilters clicked={setGenreForFilter}/>
          </div>
        <div className="audio-pagination">
        <div style={{ margin: '10px'}}>
            <img style={{width: '24px', height: '24px'}} src="images/other-audios.svg" alt="audios"/>
            <span className='audio-container-wrapper-span'>Track List</span>
          </div>
        <div className="audio-item-wrapper">
          {tracks} 
        </div>
          <Pagination>
            {items}
          </Pagination> 
        </div>
        

          </div>  
        
      <AudioFooter />
      </div>     
    )
  }

export default Audio;
