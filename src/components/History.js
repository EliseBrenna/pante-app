import React from 'react';

class History extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        }
    }
    
    handleBackProfile() {
        const { history } = this.props;
        history.push('/profile');
    }

    handleHomeClicked() {
        const { history } = this.props;
        history.push(`/home`);
    }

    handleProfileClicked() {
        const { history } = this.props;
        history.push(`/profile`);
    }

    handleSupportClicked() {
        const { history } = this.props;
        history.push(`/support`);
    }

    render() {
        return (
            <div className="historyContainer">
                <div className="history">
                    <div className="arrowLeftHistory">
                        <svg onClick={this.handleBackProfile.bind(this)} version="1.1"
                        viewBox="0 0 31.494 31.494">
                        <path style={{fill: "#127334", stroke: "#0d5526", strokeWidth:"2px"}} d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554
                        c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587 c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/>
                        </svg>
                    </div>

                    <h3>Din historikk</h3>
                    <div className="activity">
                        <div className="activities">
                        <p>Coop Mega Torgbygget <br/>28/12-19, 11:45</p>
                        <p style={{fontWeight: "bold"}}>13 kr</p>  
                        </div>
                        <div className="activities">
                        <p>Coop Mega Storo <br/>08/01-20, 12:05</p>
                        <p style={{fontWeight: "bold"}}>4 kr</p>  
                        </div>
                        <div className="activities">
                        <p>Coop Extra Vossegata <br/>07/01-20, 09:45</p>
                        <p style={{fontWeight: "bold"}}>2 kr</p>  
                        </div>
                        <div className="activities">
                        <p>Rema 1000 Storo<br/>02/01-20, 20:01</p>
                        <p style={{fontWeight: "bold"}}>13 kr</p>  
                    </div>
                </div>
            </div>
            
            <footer className="nav-bar">
                    <div className="homeIcon">
                        <svg onClick={this.handleHomeClicked.bind(this)} fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px"><path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"/>
                        </svg>
                    </div>
                    <div className="profileIcon">
                        <svg onClick={this.handleProfileClicked.bind(this)} id="Capa_1"  enable-background="new 0 0 515.556 515.556" height="23" viewBox="0 0 515.556 515.556" width="30" style={{borderBottom: "2px solid white", paddingBottom: "5px"}} xmlns="http://www.w3.org/2000/svg"><path d="m348.918 37.751c50.334 50.334 50.334 131.942 0 182.276s-131.942 50.334-182.276 0-50.334-131.942 0-182.276c50.334-50.335 131.942-50.335 182.276 0"/><path d="m455.486 350.669c-117.498-79.391-277.917-79.391-395.415 0-17.433 11.769-27.848 31.656-27.848 53.211v111.676h451.111v-111.676c0-21.555-10.416-41.442-27.848-53.211z"/>
                        </svg>
                    </div>
                    <div className="infoIcon">
                        <svg onClick={this.handleSupportClicked.bind(this)} xmlns="http://www.w3.org/2000/svg" width="12" height="40" viewBox="0 0 9 25">
                        <text id="i" transform="translate(0 20)" fill="#f5f5f5" font-size="22" font-family="Georgia-BoldItalic, Georgia" font-weight="700" font-style="italic"><tspan x="0" y="0">i</tspan></text>
                        </svg>
                    </div>  
                </footer>    
            </div>
        )
    }
}

export default History;