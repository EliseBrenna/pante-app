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
                    <div className="home">
                        <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"/></svg>
                    </div>
                </footer>
            </div>
        )
    }
}


export default Home;