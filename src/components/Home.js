import React from 'react';

class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <div className="home-content">
                Tast inn kode fra <br/>
                panteautomaten:
                    <label className="pin-input">
                        <input type="text"></input>
                        <input type="text"></input>
                        <input type="text"></input>
                        <input type="text"></input>
                    </label>
                    <button>Pant</button>
                </div>
                
                <footer className="nav-bar">
                </footer>
            </div>
        )
    }
}


export default Home;