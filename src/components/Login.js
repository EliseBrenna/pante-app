import React from 'react';
import { createSession } from '../services/session';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginForm: {
                email: '',
                password: ''
            },
            isLoggingIn: false,
            error: null
        }
    }

    handleInputChange(field, event) {
        this.setState({
            loginForm: {
                ...this.state.loginForm,
                [field]: event.target.value
            }
        })
    }

    handleSignup() {
        const { history } = this.props;
        history.push('/signup');
    }

    async handleLoginAttempt(event) {
        event.preventDefault();
        const { history } = this.props;
        const { email, password } = this.state.loginForm;

        try{
            this.setState({ isLoggingIn: true, error: null })
            const { token, error } = await createSession({ email, password })

            if(error) {
                throw new Error(error)
            }

            if(!token) {
                throw new Error('No token recieved - try again');
            }

            localStorage.setItem('pante_app_token', token);
            history.push('/')
        } catch(error) {
            this.setState({ error, isLoggingIn: false })
        }


    }
    render() {
        return (
            <div className="login">
                <img src="./logo.png" alt="logo" className="logoLogin" />
                <div className="subHeaderLogin"><h3>Logg inn for å pante</h3></div>
                <div className="loginForm">
                    <label className="inputField">
                        <input 
                        type="text" 
                        placeholder="Skriv inn e-postadresse"
                        value={this.state.loginForm.email}
                        onChange={this.handleInputChange.bind(this, 'email')} />
                        <input 
                        type="password" 
                        placeholder="Skriv inn passord"
                        value={this.state.loginForm.password}
                        onChange={this.handleInputChange.bind(this, 'password')} />
                    </label>
                </div>
                <button className="loginBtn" onClick={this.handleLoginAttempt.bind(this)}>Logg inn</button>
                <div className="newUser">
                    <h4 onClick={this.handleSignup.bind(this)}>Ny bruker?</h4>
                </div>
            </div>
        )
    }
}


export default Login;