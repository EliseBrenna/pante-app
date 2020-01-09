import React from 'react';
import { updateUser, getUserById } from '../services/session';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            isLoading: false,
            error: null,
        }
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading: true });
            const user = await getUserById(this.props.id);
            this.setState({ user, isLoading: false });
        }   catch(error) {
            this.setState({ error });
        }
    }

    async handleEditUser() {
        const { user } = this.state;
        await updateUser(user);
        const { history } = this.props;
        history.push(`/profile`);
    }

    handleChange(field, event) {
        const { user } = this.state;
        user[field] = event.target.value;
        this.setState({ user });
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
        const { user, isLoading, error } = this.state;

        if (error) {
            return (
                <div>
                    <p>Oops! Something went wrong!</p>
                    <pre>{error.message}</pre>
                    <button>Retry</button>
                </div>
            )
        }

        if (isLoading) {
            return (
                <div>
                    <p>Loading profile...</p>
                </div>
            );
        }

        return (
            <div className="edit-profile">
                <div className="arrowLeftHistory">
                    <svg onClick={this.handleBackProfile.bind(this)} version="1.1"
                    viewBox="0 0 31.494 31.494">
                    <path style={{fill: "#127334", stroke: "#0d5526", strokeWidth:"2px"}} d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554
                    c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587
                    c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/>
                    </svg>
                </div>

                <div className="sub-header-edit">
                    <h3>Endre Profil</h3>
                </div>
               
                <div className="edit-form">
                    <label className="inputField">Navn
                        <input 
                            value={user.name}
                            onChange={this.handleChange.bind(this, 'name')}
                            type="text" 
                         />E-post
                        <input 
                            value={user.email}
                            onChange={this.handleChange.bind(this, 'email')}
                            type="text" 
                         />Telefonnummer
                        <input 
                            value={user.phone}
                            onChange={this.handleChange.bind(this, 'phone')}
                            type="text" 
                             />Passord
                        <input 
                            value={user.password}
                            onChange={this.handleChange.bind(this, 'password')}
                            type="password" 
                         />Bekreft passord
                        <input 
                            value={user.password}
                            onChange={this.handleChange.bind(this, 'password')}
                            type="password" 
                         /> 
                    </label>
                </div>

                <div className="submit-button" onClick={this.handleEditUser.bind(this)}>
                    <button>Lagre</button>
                </div>

                <footer className="nav-bar-edit">
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
                        <svg fill="#FFFFFF" onClick={this.handleSupportClicked.bind(this)} width="30" height="30" ><path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
                        </svg>
                    </div>  
                </footer>
            </div>
        )
    }
}

export default EditProfile;