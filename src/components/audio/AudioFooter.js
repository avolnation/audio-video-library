import React from "react";



const AudioFooter = props => {
    
    const ctx = new AudioContext();
    let audio;

    const fetchSong = () =>
    fetch("http://localhost:3002/audios-and-images/1660674057282Alan Walker - Ignite.mp3")
        .then((res) => {
            console.log(res.blob())
            res.arrayBuffer()})
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .catch(err => console.log(err));

    const playback = async () => {
        const playSound = ctx.createBufferSource();
        await fetchSong()
        .then(res => {
            console.log(ctx)
            playSound.buffer = ctx;
            playSound.connect(ctx.destination);
            playSound.start(ctx.currentTime);
        } 
        )
        

    }


    return (
        <div className="player">
            <div className="player-controls">
                <div className="previous-track-button">
                    <img src="/images/previous-track.svg" alt="play"/>
                </div>
                <div onClick={playback} className="play-button">
                    <img src="/images/play-button.svg" alt="play"/>
                </div>
                <div className="next-track-button">
                    <img src="/images/previous-track.svg" alt="play"/>
                </div>
            </div>
        </div>
    )

}
    
export default AudioFooter;