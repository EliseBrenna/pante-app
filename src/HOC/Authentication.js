import React from 'react';
import jwt from 'jsonwebtoken'

class Authentication extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            shouldUpdateToggle: true
        };
    }

    checkAuth() {
        try {
            const { history } = this.props;
            const token = localStorage.getItem('pante_app_token');
            const payload = jwt.decode(token);

            if(!payload) {
                history.replace('/login')
            } else {
                this.setState({
                    isAuthenticated: true
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }
        

    componentDidMount() {
        this.checkAuth();
    }

    componentDidUpdate() {
        this.checkAuth();
    }

    shouldComponentUpdate() {
        const token = localStorage.getItem('pante_app_token');
        const payload = jwt.decode(token);
        if(payload && this.state.isAuthenticated && !this.state.shouldUpdateToggle){
            return false
        }
        this.setState({
            shouldUpdateToggle: false
        })
        return true;
    }

    render() {
        const { isAuthenticated } = this.state;
        const { children } = this.props;
        return(
            <div>
                {isAuthenticated ?( children ):( <div>Authenticating...</div>)}
            </div>
        )
    }
    
}

export default Authentication;