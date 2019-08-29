import React from 'react';
import HomeComponent from './components/HomeComponent';

class App extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      label: 'session',
      breakLen: 5,
      sessionLen: 25,
      sessionTimeLeft: 25*(1000*60),
      breakTimeLeft: 5*(1000*60),
      timer: '25:00',
      isPlay: false,
      timerId: null,
    }
    
  }

  render(){
    return (
      <div>
        <HomeComponent default={this.state} />
      </div>
    );
  }
}

export default App;
