import React from 'react';
import Barcode from 'react-barcode'

class Profile extends React.Component {
    render() {
        return (
            <div>
            <Barcode value="Aske" />
            <div>
                Profile
                </div>    
            </div>
        )
    }
}


export default Profile;