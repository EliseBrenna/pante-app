import React from 'react';

class Signup extends React.Component {
    render() {
        return (
            <div className="signup">
                <img src="./logo.png" alt="logo" className="logoLogin" />
                <div className="subHeaderLogin"><h3>Logg inn for å pante</h3></div>
                <div className="loginForm">
                    <label className="inputField">
                        <input type="text" placeholder="Skriv inn e-postadresse" />
                        <input type="text" placeholder="Skriv inn passord" />
                    </label>
                </div>
                <button className="loginBtn">Logg inn</button>
                <div className="newUser">
                    <h4><a href="/#/signup">Ny bruker?</a></h4>
                </div>
            </div>
        )
    }
}


export default Signup;