import React from 'react';

class Logout extends React.Component {
    componentDidMount() {
        const { history } = this.props;
        localStorage.removeItem('pante_app_token');
        history.replace('/');
      }
    
      render() {
        return (
          <div>Logger ut...</div>
        );
      }
    }
    
    export default Logout;