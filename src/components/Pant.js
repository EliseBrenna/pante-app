import React from 'react';
import { addPantData } from '../services/pantSession';


class Pant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        code: '',
        amount: 0,
        id: 0,
        timer: 25,
        lotteryPop: false,
        activeSession: false,
        countValid: false
    }
    this.timer = null;
  }

  // POSTING
  handleClick = async (panteSum) => {
    if (!this.state.activeSession) {
      this.setState((prevState, { amount }) => ({
        amount: prevState.amount += panteSum
      }));
  
      // function animate() {
      //   document.getElementsByClassName("bottle").classList.toggle("animate");
      // }
      // animate();
    } else {
      this.setState({
        code: '',
        amount: 0,
        activeSession: false,
        lotteryPop: false,
        isClicked: false
      })
      
    }
  };



  createCode = async () => {
    const { isClicked} = this.state;
    this.setState({isClicked: true})
    function makeCode(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      
      return result;
   }
   if(isClicked) {
     this.setState({lockButton: 'disabled'})
   }
   let resultCode = makeCode(4);

    await this.setState(({ code }) => ({
      code: resultCode,
      lotteryPop: false,
      activeSession: true,
    }));

    let session = {
      code: this.state.code,
      amount: this.state.amount,
      id: this.state.id
    }
    addPantData(session);
    await this._timer();
  };

  lotteryPop() {
    this.setState({
      lotteryPop: true,
      activeSession: true,
    })
  }

  _timer() {
    const { timer, countValid } = this.state;
    this.setState({timer: timer - 1, countValid: true})
    if(timer === 0 && countValid) {
      this.resetScreen()
      return clearTimeout(this._timer)
    }
    setTimeout(this._timer.bind(this), 1000)
  }
  
  resetScreen() {
      this.setState ({
        lotteryPop: false,
        code: '',
        amount: 0,
        timer: 25,
        countValid: false,
        isClicked: false
      })
    }
    

  render() {
    const { timer, countValid, isClicked } = this.state;
    return (
      <div className="panteContainer">
        <div className="panteAutomat">

          {!this.state.lotteryPop ? (
            <div className="screen">
              <p>Pantesum: {this.state.amount}kr</p>
              <p>Pin-kode: {this.state.code}</p>
          <p className="timer">{countValid ? (timer) : null}</p>  
            </div>
          ) : (
            <div className="screen">
              <p>Ingen premie <br />denne gangen! :(</p>
            </div>
          )}

          <div className="recycleButton">
          	<button className="greenButton" disabled={isClicked} onClick={() => this.createCode()} ></button>
          </div>
          <button className="redCross" onClick={() => this.lotteryPop()}>+</button>
          <img src="./pantomat2.svg" alt="panteautomat"></img>  
        </div>

        <div className="display">
        	<h1>Pantesimulator</h1>
          	<img className="bottle" src="./soda_small.png" alt="liten flaske"></img>
            <button className="buttonKr" onClick={this.handleClick.bind(this, 2)}>+</button>
            <img className="bigBottle" src="./soda_big.png" alt="stor flaske"></img>
            <button className="buttonKr"onClick={this.handleClick.bind(this, 3)}>+</button>
  
            <div className='mobileUser'>

        	</div>
        </div>
      </div>
    );
  }
}

export default Pant;