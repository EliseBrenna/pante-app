import React from 'react';
import { updatePassword } from '../services/session';
const { passwordTest } = require('../RegExp')

class changePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: {},
            error: null,
            passwordError: null,
        }
    }

    async componentDidMount() {
        this.setState({ 
            editForm: {
                password: "",
                newPassword: "",
                confirmPassword: ""
            }
        });
    }

    handleInputChange(field, event) {
        this.setState({
            editForm: {
                ...this.state.editForm,
                [field]: event.target.value,
            }
        })
    }

    async handleSubmitAttempt(event) {
        event.preventDefault();
        const { history } = this.props;
        const { password, newPassword, confirmPassword } = this.state.editForm;

        if (confirmPassword !== newPassword) {
            this.setState({ passwordError: "Nytt passord matcher ikke!"})
        } else if (confirmPassword && !passwordTest(newPassword)) {
            this.setState({ passwordError: "Passordet ikke gyldig. Minimum 8 tegn, minst en bokstav og et tall påkrevd" })
        } else {
            try {
                this.setState({ isLoading: true });
                const editedUser = await updatePassword({ password, newPassword });
                if (editedUser.status === 401) {
                    this.setState({ error: editedUser.message })
                } else {
                    history.replace('/editprofile');
                }
            } catch (error) {
                this.setState({ error })
            }
        }
    }

    render() {
        const { error, passwordError } = this.state

        return (
        <div className="edit-form">
            <label className="inputField" id="iconPassword">
                <input 
                    value={this.state.editForm.password}
                    onChange={this.handleInputChange.bind(this, 'password')}
                    type="password" 
                    placeholder="Gammelt passord (påkrevd)"
                    />
                <div className="errorMessage">
                    {error && <p>{error}</p>}
                </div>     
            </label>
            <label className="inputField" id="iconPassword">
                <input 
                    value={this.state.editForm.newPassword}
                    onChange={this.handleInputChange.bind(this, 'newPassword')}
                    type="password" 
                    placeholder="Nytt passord (ikke påkrevd)"
                    /> 
            </label>
            <label className="inputField" id="iconPassword">
                <input 
                    value={this.state.editForm.confirmPassword}
                    onChange={this.handleInputChange.bind(this, 'confirmPassword')}
                    type="password" 
                    placeholder="Bekreft nytt passord"
                    />
                <div className="errorMessage">
                    {passwordError && <p>{passwordError}</p>}
                </div>     
            </label>
            <button onClick={this.handleSubmitAttempt.bind(this)}>Lagre</button>
        </div>
        )
    }    
}

export default changePassword;