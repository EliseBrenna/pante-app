import React from 'react';
import { createUser } from '../services/session'

class Signup extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            signupForm: {
                name: '',
                email: '',
                phone: '',
                password: ''
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

    async handleSubmitAttempt(event) {
        event.preventDefault();
        const { history } = this.props;
        const { name, email, phone, password } = this.state.signupForm;

        try{
            this.setState({ isLoading: true });
            await createUser({ name, email, phone, password });
            history.replace('/home')
        } catch (error) {
            this.setState({ error })
        }
    }


    render() {
        return (
            <div className="signup">
                <img src="./logo.png" alt="logo" className="logoLogin" />
                <div className="subHeaderLogin"><h3>Logg inn for å pante</h3></div>
                <div className="loginForm">
                    <label className="inputField">
                        <input type="text" placeholder="Skriv inn ditt navn" />
                        <input type="text" placeholder="Skriv inn e-postadresse" />
                        <input type="text" placeholder="Skriv inn ditt telefonnummer" />
                        <input type="password" placeholder="Skriv inn passord" />
                        <input type="password" placeholder="Gjenta passord" />
                    </label>
                </div>
                <button className="signupBtn">Logg inn</button>
                <div className="newUser">
                    <h4><a href="/#/signup">Ny bruker?</a></h4>
                </div>
            </div>
        )
    }
}


export default Signup;