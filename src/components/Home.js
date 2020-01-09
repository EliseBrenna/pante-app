import React from 'react';
import { updatePantData2 } from '../services/pantSession';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userCode: "",
            view: '',
            params: {},
            pantPop: false
        }
    }

    // Handeling input from the user
    handleSubmit(event) {
        let session = {
            userCode: this.state.userCode,
        }
        event.preventDefault();

        updatePantData2(session);
        this.setState({
            userCode: '',
            pantPop: true
        })
    }

    handleInputChange(field, event) {
        this.setState({
            ...this.state,
            [field]: event.target.value
        });
    }

    handleChangeView(view = '', params = {}) {
        this.setState({ view, params });
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

    handlePantExit() {
        this.setState({
            pantPop: false
        })
    }

    render() {

        return (
            <div className="home">
                <img className="logo-home" src="./logo.png" alt="logo"></img>

                {
                    !this.state.pantPop? (
                        <div className="home-content">
                        Tast inn kode fra <br/>
                        panteautomaten
                        
                        {/* Form to sumbit code */}
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <label htmlFor='userCode'>
                            <input 
                                type='text'
                                name='userCode'
                                maxLength="4"
                                value={this.state.userCode}
                                onChange={this.handleInputChange.bind(this, 'userCode')}
                            />
                            </label>
                            <div><button>Pant</button></div>
                        </form>
                    </div>
                    ) : (
                        <div className="pantePop">
                            <div className="pantBtnContainer"><button className="exitBtn" onClick={() => this.handlePantExit()}>x</button></div>
                            <h4>Din pant er registrert. <br />Du pantet for xx kroner.</h4>
                        </div>
                    )
                }
                
                <footer className="nav-bar">
                    <div className="homeIcon" >
                        <svg onClick={this.handleHomeClicked.bind(this)} fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30px" height="30px" style={{borderBottom: "2px solid white", paddingBottom: "2px"}}>
                            <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 
                            L 12 2.0996094 z"/>
                        </svg>
                    </div>
                    <div className="profileIcon">
                        <svg onClick={this.handleProfileClicked.bind(this)} id="Capa_1"  enable-background="new 0 0 515.556 515.556" height="23" viewBox="0 0 515.556 515.556" width="30" xmlns="http://www.w3.org/2000/svg"><path d="m348.918 37.751c50.334 50.334 50.334 131.942 0 182.276s-131.942 50.334-182.276 0-50.334-131.942 0-182.276c50.334-50.335 131.942-50.335 182.276 0"/><path d="m455.486 350.669c-117.498-79.391-277.917-79.391-395.415 0-17.433 11.769-27.848 31.656-27.848 53.211v111.676h451.111v-111.676c0-21.555-10.416-41.442-27.848-53.211z"/></svg>
                    </div>
                    <div className="infoIcon">
                        <svg onClick={this.handleSupportClicked.bind(this)} xmlns="http://www.w3.org/2000/svg" width="13" height="40" viewBox="0 0 9 25">
                            <text id="i" transform="translate(0 20)" fill="#f5f5f5" font-size="22" font-family="Georgia-BoldItalic, Georgia" font-weight="700" font-style="italic">
                                <tspan x="0" y="0">i</tspan>
                            </text>
                        </svg>
                    </div>  
                </footer>
            </div>
        )
    }
}


export default Home;