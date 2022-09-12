import React, { Component } from 'react'
import './audioFilter.css'


class AudioFilters extends Component {

  state = {
    filters: ['Pop', 'Electro', 'Jazz', 'RnB', 'Rap', 'House', 'Classic'],
    activeGenre: ''
  } 

  componentDidUpdate(){
    console.log(this.props.activeGenre + '|' + this.state.activeGenre)
  }
  
  render() {
    return (
      <div className='audios-genres-wrapper'>
          {this.state.filters.map(el => {
          return (
            <div id={el} onClick={(el) => {this.props.clicked(el); this.setState({activeGenre: el.target.id})}} className={'audios-genre-item' + (el == this.state.activeGenre ? ' selected-genre' : '')} key={el}>{el}</div>
          )}
          )}
      </div>
    )
}
}

export default AudioFilters