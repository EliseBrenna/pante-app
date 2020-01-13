import React from 'react';
import Authentication from './Authentication'

function withAuthentication(Component) {
    return class extends React.Component {
        render() {
            return(
                <Authentication {...this.props}>
                    <Component {...this.props} />
                </Authentication>
            );
        }
    }
}

export default withAuthentication;