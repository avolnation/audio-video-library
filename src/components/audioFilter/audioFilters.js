import React, { Component } from 'react'
import './audioFilter.css'


class AudioFilters extends Component {

  state = {
    filters: ['Pop', 'Electro', 'Jazz', 'RnB', 'Rap', 'House', 'Classic']
  } 
  
  render() {
    return (
      <div className='audios-genres-wrapper'>
          {this.state.filters.map(el => {
          return (
            <div id={el} onClick={(el) => this.props.clicked(el)} className='audios-genre-item' key={el}>{el}</div>
          )}
          )}
      </div>
    )
}
}

export default AudioFilters