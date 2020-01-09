import React from 'react';
import { addPantData, updatePantData } from '../services/pantSession';

class Pant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        code: '',
        amount: 0,
        id: 0,
        userCode: '',
        userId: 0,
        lotteryPop: false
    }
  }

  // POSTING 
  handleClick = (panteSum) => {
    this.setState((prevState, { amount }) => ({
      amount: prevState.amount += panteSum
    }));
  };

  createCode = async () => {
    function makeCode(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }

   let resultCode = makeCode(4);

    await this.setState(({ code }) => ({
      code: resultCode,
      lotteryPop: false
    }));

    let session = {
      code: this.state.code,
      amount: this.state.amount,
      id: this.state.id
    }
    addPantData(session);
  };

  lotteryPop() {
    this.setState({
      lotteryPop: true
    })
  }

// Handeling input from the user
  handleSubmit(event) {
      let session = {
        userCode: this.state.userCode,
        userId: parseInt(this.state.userId)
      }
    event.preventDefault();

    if (this.state.code === this.state.userCode && this.state.userId) {
       updatePantData(session);
       alert('Pant lagt til i din saldo!')
       this.setState({
        code: '',
        amount: 0,
        id: 0,
        userCode: '',
        userId: 0,
    })
    } else {
      alert('Vennligst tast inn korrekt kode og bruker-id')
    }

}

  render() {
    return (
      <div className="panteContainer">
        <div className="panteAutomat">

          {!this.state.lotteryPop ? (
            <div className="screen">
              <p>Pantesum: {this.state.amount}kr</p>
              <p>Pin-kode: {this.state.code}</p>
            </div>
          ) : (
            <div className="screen">
              <p>Ingen premie <br />denne gangen! :(</p>
            </div>
          )}

          <div className="recycleButton">
          	<button className="greenButton" onClick={() => this.createCode()}></button>
          </div>
          <button className="redCross" onClick={() => this.lotteryPop()}>+</button>
          <img src="./pantomat.svg" alt="panteautomat"></img>  
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