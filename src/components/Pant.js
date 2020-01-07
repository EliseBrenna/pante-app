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
      return result
   }

   let resultCode = makeCode(4);

    await this.setState(({ code }) => ({
      code: resultCode
    }));

    let session = {
      code: this.state.code,
      amount: this.state.amount,
      id: this.state.id
    }
    addPantData(session);
  };

  
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

handleInputChange(field, event) {
  this.setState({
          ...this.state,
          [field]: event.target.value
  });
}
// 

  render() {
    return (
      <div className="panteContainer">
        <div className="pantHer"><h1>Pant her</h1></div>
        <div className="display">
          
            <button onClick={this.handleClick.bind(this, 2)}>2kr</button>
            <button onClick={this.handleClick.bind(this, 3)}>3kr</button>
            <p>Pantesum: {this.state.amount}kr</p>
            <button onClick={() => this.createCode()}>Ferdig</button>
            <p>{this.state.code}</p>
        </div>

        <div className='mobileUser'>
        <form onSubmit={this.handleSubmit.bind(this)}>
            <label htmlFor='userCode'>
              Code:
              <input 
                type='text'
                name='userCode'
                value={this.state.userCode}
                onChange={this.handleInputChange.bind(this, 'userCode')}
              />
            </label>
            bruker-ID
            <label htmlFor='userId'>
              <input 
                type='number'
                name='userId'
                value={this.state.userId}
                onChange={this.handleInputChange.bind(this, 'userId')}
              />
            </label>
            <button>Trykk når felt er skrevet inn</button>
          </form>
        </div>

      </div>
    );
  }
}

export default Pant;