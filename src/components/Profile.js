import React from 'react';
import Barcode from 'react-barcode'
import jwtDecode from 'jwt-decode';
import { getUserById } from '../services/session';
import { saldoData } from '../services/pantSession'


class Profile extends React.Component {
    constructor(props){
        super(props);

        const token = localStorage.getItem('pante_app_token');
        const payload = jwtDecode(token);

        this.state = {
            isLoading: false,
            error: null,
            session: payload,
            saldo: '',
            view: '',
            params: {}
        }
    }

    async componentDidMount() {
        await this.currentSaldo();
    }

    async currentSaldo() {
        try {
            this.setState({ isLoading: true })
            const { id } = this.state.session;
            console.log(id)
            const saldo = await saldoData();
            console.log(saldo)
            const sum = saldo
            .map(({amount}) => amount)
            .reduce((accu, curr) => accu+curr, 0)
            this.setState({ saldo: sum, isLoading: false })
        } catch (error) {
            this.setState({ error });
        }
    }
    
      handleHistory() {
        const { history } = this.props;
        history.push('/history');
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

    handleEditProfileClicked() {
        const { history } = this.props;
        history.push(`/editprofile`);
    }

    render() {
        const { 
            saldo,
            session: {
                id,
                name
            } = {}
         } = this.state;


        return (
            <div className="profile">
                <div className="profile-barcode">
                    <div className="barcode">
                        <Barcode value={id + saldo}/>
                        <div className="userName">
                            <h2>{name}</h2>
                        </div>
                    </div>
                </div>
                <div className="profile-balance">
                    
                    <div className="balance">
                        <h4>Saldo</h4>
                        <h1>{saldo} kr</h1>
                    </div>
                    <div>
                        <button onClick={this.handleHistory.bind(this)}>Historikk</button>
                    </div>
                    <div>
                        <button onClick={this.handleEditProfileClicked.bind(this)}>Endre profil</button>
                    </div>
                    <div>
                        <button className="toAccount" >Overfør til konto</button>
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
                    <svg fill="#FFFFFF" onClick={this.handleSupportClicked.bind(this)}  width="24" height="24"><path d="M24 14v-4c-1.619 0-2.906.267-3.705-1.476-.697-1.663.604-2.596 1.604-3.596l-2.829-2.828c-1.033 1.033-1.908 2.307-3.666 1.575-1.674-.686-1.404-2.334-1.404-3.675h-4c0 1.312.278 2.985-1.404 3.675-1.761.733-2.646-.553-3.667-1.574l-2.829 2.828c1.033 1.033 2.308 1.909 1.575 3.667-.348.849-1.176 1.404-2.094 1.404h-1.581v4c1.471 0 2.973-.281 3.704 1.475.698 1.661-.604 2.596-1.604 3.596l2.829 2.829c1-1 1.943-2.282 3.667-1.575 1.673.687 1.404 2.332 1.404 3.675h4c0-1.244-.276-2.967 1.475-3.704 1.645-.692 2.586.595 3.596 1.604l2.828-2.829c-1-1-2.301-1.933-1.604-3.595l.03-.072c.687-1.673 2.332-1.404 3.675-1.404zm-12 2c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
                    </div>  
                </footer>    
            </div>
        )
    }
}

export default Profile;