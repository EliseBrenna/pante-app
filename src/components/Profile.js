import React from 'react';
import Barcode from 'react-barcode'

class Profile extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        }
      }
    
      handleHistory() {
        const { history } = this.props;
        history.push('/history');
      }

    render() {
        return (
            <div className="profile">
                <div className="profile-barcode">
                    <div className="barcode">
                        <Barcode value="Aske" />
                    </div>
                </div>
                <div className="profile-balance">
                    <div>
                        <h3>Saldo</h3>
                    </div>
                    <div className="balance">
                        <h1>237 kr</h1>
                    </div>
                    <div>
                        <button onClick={this.handleHistory.bind(this)}>Historikk</button>
                    </div>
                    <div>
                        <button>Endre profil</button>
                    </div>
                    <div>
                        <button>Overfør til konto</button>
                    </div> 
                </div>
                <footer className="nav-bar">
                    <div className="homeIcon">
                        <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"/></svg>
                    </div>
                    <div className="profileIcon">
                        <svg id="Capa_1"  enable-background="new 0 0 515.556 515.556" height="23" viewBox="0 0 515.556 515.556" width="30" xmlns="http://www.w3.org/2000/svg"><path d="m348.918 37.751c50.334 50.334 50.334 131.942 0 182.276s-131.942 50.334-182.276 0-50.334-131.942 0-182.276c50.334-50.335 131.942-50.335 182.276 0"/><path d="m455.486 350.669c-117.498-79.391-277.917-79.391-395.415 0-17.433 11.769-27.848 31.656-27.848 53.211v111.676h451.111v-111.676c0-21.555-10.416-41.442-27.848-53.211z"/></svg>
                    </div>
                    <div className="infoIcon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="40" viewBox="0 0 9 25">
                        <text id="i" transform="translate(0 20)" fill="#f5f5f5" font-size="22" font-family="Georgia-BoldItalic, Georgia" font-weight="700" font-style="italic"><tspan x="0" y="0">i</tspan></text>
                    </svg>
                    </div>  
                </footer>    
            </div>
        )
    }
}


export default Profile;