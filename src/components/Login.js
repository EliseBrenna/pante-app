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
            type: 'password',
            fill: false,
            inputClass: "valid",
            styles: {
                email: {

                },
                password: {

                }
            }
        }
    }

    handleClick = () => this.setState(({type}) => ({
        type: type === 'text' ? 'password' : 'text',
        fill: !this.state.fill
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
            const { token, error } = await createSession({ email, password });
            if (error) {
                this.setState({ error: loginAttempt.message, inputClass: "invalid"});
            } else if(loginAttempt.status === 401) {
                this.setState({ error: loginAttempt.message, inputClass: "invalid" });
                console.log(this.state.styles.border)
            } else if (this.state.email === '') {
                this.setState({ error: 'Please put in an valid email', inputClass: "invalid"});
            } else if (this.state.password === '') {
                this.setState({ error: 'Please put in a valid password', inputClass: "invalid"});
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

        return (
            <div className="login">
                <img src="./logo.png" alt="logo" className="logoLogin" />
                <div className="subHeaderLogin"><h3>Logg inn for å registrere pant</h3></div>
                    <div className="loginForm">
                        <label className="inputField" id="iconUsername">
                            <input 
                            type="email"
                            className={this.state.inputClass}
                            placeholder="Skriv inn e-post"
                            value={this.state.loginForm.email}
                            onChange={this.handleInputChange.bind(this, 'email')} />
                        </label>
                        
                        <div className="inputPassword">
                        <label className="inputField passwordEye" id="iconPassword">    
                            <input 
                            type={this.state.type} 
                            className={this.state.inputClass}
                            placeholder="Skriv inn passord"
                            value={this.state.loginForm.password}
                            onChange={this.handleInputChange.bind(this, 'password')} />
                            <svg id="passwordEye" onClick={this.handleClick} width="25" height="21" fill={(this.state.fill? "black" : "none")} stroke="#000">{this.state.type === 'text' ? 'skjul' : 'vis'} 
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/></svg>
                            </label>
                            </div>
                            <div className="errorMessage">
                            {error && <p>{error}</p>}
                            </div>                     
                    </div>
                <button className="loginBtn" onClick={this.handleLoginAttempt.bind(this)}>Logg inn</button>
                <div className="newUser">
                    <h3 onClick={this.handleSignup.bind(this)}>Ny bruker?</h3>
                </div>
                <div className="appVersion">
                    <p>Beta v. 1.5</p>
                </div>
            </div>
        )
    }
}

export default Login;
