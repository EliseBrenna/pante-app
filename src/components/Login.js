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
            error: null,
            type: 'text'
        }
    }

    handleClick = () => this.setState(({type}) => ({
        type: type === 'text' ? 'password' : 'text'
      }))

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

        try {
            this.setState({ isLoggingIn: true, error: null });
            const loginAttempt = await createSession({ email, password });
            console.log (loginAttempt);
            const { token, error } = await createSession({ email, password });
            if (error) {
                this.setState({ error: loginAttempt.message});
            } else if(loginAttempt.status === 401) {
                this.setState({ error: loginAttempt.message });
            } else if (this.state.email === '') {
                this.setState({ error: 'Please put in an valid email' });
            } else if (this.state.password === '') {
                this.setState({ error: 'Please put in a valid password' });
            } else {
                localStorage.setItem('pante_app_token', token);
                history.push('/');
            }

        } catch (error) {
            this.setState({ error, isLoggingIn: false });
        }
    }

    render() {
        const { error } = this.state;
        const { label } = this.props
        return (
            <div className="login">
                <img src="./logo.png" alt="logo" className="logoLogin" />
                <div className="subHeaderLogin"><h3>Logg inn for å registrere pant</h3></div>
                    <div className="loginForm">
                        <label className="inputField" id="iconUsername">
                            <input 
                            type="email" 
                            placeholder="Skriv inn e-postadresse"
                            value={this.state.loginForm.email}
                            onChange={this.handleInputChange.bind(this, 'email')} />
                        </label>
                        <label className="inputField" id="iconPassword">
                            <input 
                            type={this.state.type} 
                            placeholder="Skriv inn passord"
                            value={this.state.loginForm.password}
                            onChange={this.handleInputChange.bind(this, 'password')} />
                            <span className="password_show" onClick={this.handleClick}>{this.state.type === 'text' ? 'show' : 'hide'}</span>
                            <div className="errorMessage">
                            {error && <p>{error}</p>}
                            </div>
                        </label>
                    </div>

                <button className="loginBtn" onClick={this.handleLoginAttempt.bind(this)}>Logg inn</button>
                <div className="newUser">
                    <h3 onClick={this.handleSignup.bind(this)}>Ny bruker?</h3>
                </div>
                <div className="appVersion">
                    <p>Beta v. 1.3</p>
                </div>
            </div>
        )
    }
}

export default Login;