import React from 'react';

class HomeComponent extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      label: 'session',
      breakLen: 5,
      isPlay: false,
      sessionLen: 25,
      sessionTimeLeft: 25*(1000*60),
      breakTimeLeft: 5*(1000*60),
      timer: '25:00',
      timerId: null,
    }

    this.handleReset = this.handleReset.bind(this);
    this.counterBtn = this.counterBtn.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.play = this.play.bind(this);
    this.tick = this.tick.bind(this);
    this.buzzer = this.buzzer.bind(this);
  }

  handleReset(){
    clearInterval(this.state.timerId);
    this.setState(this.props.default);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  counterBtn(e){
    const id = (e.target.tagName === 'BUTTON'? e.target.id : e.target.parentNode.id).split('-');

    if(id[0] === 'session' && !this.state.isPlay){
      this.setState({
        sessionLen: this.updateCounter(this.state.sessionLen, id[1]),
        sessionTimeLeft: parseInt(this.updateCounter(this.state.sessionLen, id[1])) * (1000*60)
      });
    }
    
    else if(id[0] === 'break' && !this.state.isPlay){ 
      this.setState({ 
        breakLen: this.updateCounter(this.state.breakLen, id[1]),
        breakTimeLeft: parseInt(this.updateCounter(this.state.sessionLen, id[1])) * (1000*60)
      });
    }
  }

  minMax(number){
    if(number > 60 || number <= 0)
      return false;
    return true
  }

  updateCounter(counter, status){
    if(status === 'increment')
      return this.minMax(counter+1)? ++counter : counter;   
      
    return this.minMax(counter-1)? --counter : counter;   
  }

  updateTimer(){
    let leftTime = 0;

    if(this.state.label === 'session')
      leftTime = this.state.sessionTimeLeft;
    else if(this.state.label === 'break')  
      leftTime = this.state.breakTimeLeft;

    let minutes = Math.floor(leftTime/(1000*60));
    leftTime -= minutes * (1000*60);
    let seconds = Math.floor(leftTime / 1000);

    return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
  }

  play(){
    if(this.state.isPlay){
      clearInterval(this.state.timerId);
      this.setState({ isPlay: false, timerId: null })

    }else {
      this.setState({ isPlay: true, timerId: this.tick() })

    }
  }

  tick(){

    let distTime = new Date().getTime(); 
    
    if(this.state.label === 'session') distTime += this.state.sessionTimeLeft 
    else distTime += this.state.breakTimeLeft

    const timer = setInterval(() => {
      let distance = distTime - (new Date()).getTime();
      
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      if(this.state.label === 'session'){
        this.setState({
          sessionTimeLeft: this.state.sessionTimeLeft - (1000),
          timer: `0${minutes}`.slice(-2) + ':' + seconds 
        })
      } else {
        this.setState({
          breakTimeLeft: this.state.breakTimeLeft - (1000),
          timer: `0${minutes}`.slice(-2) + ':' + seconds 
        })
      }

      if(this.state.sessionTimeLeft === 0 || this.state.breakTimeLeft === 0)
        this.buzzer();

      if(this.state.sessionTimeLeft < 0 || this.state.breakTimeLeft < 0){
        clearInterval(this.state.timerId)
        this.setState({ 
          label: this.state.label === 'session'? 'break' : 'session',
          sessionTimeLeft: this.state.sessionLen * (1000 * 60),
          breakTimeLeft: this.state.breakLen * (1000 * 60),
          timerId: this.tick() 
        })
      }

    },1000)

    return timer;
  }

  buzzer() {
    if(this.state.isPlay)
      this.audioBeep.play();
  }
  
  render(){
    return (
      <div>
        <h2 className="title">Pomodoro Clock</h2>
        <div className="card mt-3">
          <div className="flex">
            <div className="col">
              <label id="break-label">Break length</label>
              <div className="counter">
                <div className="control">
                  <button onClick={this.counterBtn} id="break-increment"><i className="fa fa-chevron-up"></i></button>
                  <button onClick={this.counterBtn} id="break-decrement"><i className="fa fa-chevron-down"></i></button>
                </div>
                <span id="break-length">{ this.state.breakLen }</span>
              </div>
            </div> 
            <div className="col">
              <label id="session-label">Session length</label>
              <div className="counter">  
                <div className="control">
                  <button onClick={this.counterBtn} id="session-increment"><i className="fa fa-chevron-up"></i></button>
                  <button onClick={this.counterBtn} id="session-decrement"><i className="fa fa-chevron-down"></i></button>
                </div>
                <span id="session-length">{ this.state.sessionLen }</span>
              </div>
            </div> 
          </div>
          <div className="timer">
            <h3 id="timer-label">{ this.state.label }</h3>
            <span id="time-left">{ this.updateTimer() }</span>
            <button onClick={this.play} id="start_stop">Start/Stop</button>
            <button onClick={this.handleReset} id="reset"><i className="fa fa-refresh"></i></button>
            <audio id="beep" preload="auto" src="https://goo.gl/65cBl1" ref={(audio) => { this.audioBeep = audio }} />
          </div>
        </div>
      </div>
    );
  }
}

export default HomeComponent;
