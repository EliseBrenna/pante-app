import React from 'react';
import { createUser } from '../services/session';

class Signup extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            signupForm: {
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            },
            isLoading: false,
            error: null,
        }
    }

    handleInputChange(field, event) {
        this.setState({
            signupForm: {
                ...this.state.signupForm,
                [field]: event.target.value,
            }
        })
    }

    handleLogin(){
        const { history } = this.props;
        history.push('/login');
    }

    async handleSubmitAttempt(event) {
        event.preventDefault();
        const { history } = this.props;
        const { name, email, phone, password, confirmPassword } = this.state.signupForm;

        if(confirmPassword !== password) {
            this.setState({ error: "Passwords don't match!" })
        } else {
            try{
                this.setState({ isLoading: true });
                const newUser = await createUser({ name, email, phone, password });
                console.log(newUser)
                if(newUser.status === 403) {
                    this.setState({ error: newUser.message })
                } else {
                history.replace('/home')
                }
            } catch (error) {
                this.setState({ error })
            }
        }
       
    }


    render() {

        const { error } = this.state;
        return (
            <div className="signup">
            <div className="arrowLeft" onClick={() => this.handleLogin()}>
            <svg version="1.1"
	 viewBox="0 0 31.494 31.494">
<path style={{fill: "#127334"}}  d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554
	c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587
	c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z"/>
</svg>
            </div>
                <img src="./logo.png" alt="logo" className="logoLogin" />
                <div className="subHeaderLogin"><h3>Opprett ny bruker</h3></div>
                <div className="loginForm">
                    <label className="inputField">
                        <input 
                            type="text" 
                            placeholder="Skriv inn fult navn" required
                            value={this.state.signupForm.name}
                            onChange={this.handleInputChange.bind(this, 'name')}
                         />
                        <input 
                            type="text" 
                            placeholder="Skriv inn e-postadresse"
                            value={this.state.signupForm.email}
                            onChange={this.handleInputChange.bind(this, 'email')}
                         />
                        <input 
                            type="text" 
                            placeholder="Skriv inn ditt telefonnummer"
                            value={this.state.signupForm.phone}
                            onChange={this.handleInputChange.bind(this, 'phone')}
                             />
                        <input 
                            type="password" 
                            placeholder="Skriv inn passord"
                            value={this.state.signupForm.password}
                            onChange={this.handleInputChange.bind(this, 'password')}
                         />
                        <input 
                            type="password" 
                            placeholder="Gjenta passord"
                            value={this.state.signupForm.confirmPassword}
                            onChange={this.handleInputChange.bind(this, 'confirmPassword')}
                         />
                         <div>
                    {error && <p>{error}</p>}
                </div>
                    </label>
                </div>
                <button className="signupBtn" onClick={this.handleSubmitAttempt.bind(this)}>Registrer</button>
                
            </div>
        )
    }
}


export default Signup;