import React from 'react';
import Authentication from './Authentication'

function withAuthentication(Foo) {
    return class extends React.Component {
        render() {
            console.log(this.props);
            return(
                <Authentication {...this.props}>
                    <Foo {...this.props} />
                </Authentication>
            );
        }
    }
}

export default withAuthentication;