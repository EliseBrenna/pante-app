// Returns true if password passes regex-test
function passwordTest (password) {
    const re = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    return re.test(password);
}

// Returns true if 
function emailTest (email) {
    const re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    return re.test(email);
}

module.exports = {
    passwordTest, 
    emailTest
}