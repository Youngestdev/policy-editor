export const initialState = {
    // user: JSON.parse(localStorage.getItem('user')) || null,
    access_token: localStorage.getItem('access_token') || null,
    isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')) || false,
    loggedInTime: localStorage.getItem('loggedInTime') || null
}

export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            // set the user and access_token to the localstorage
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('access_token', action.payload.access_token);
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('loggedInTime', new Date());        
        return {
            ...state,
            user: action.payload.user,
            access_token: action.payload.access_token,
            isLoggedIn: true,
            loggedInTime: new Date()
        };
        case 'LOGOUT':
            // clear the localstorage
            localStorage.clear();
        return {
            ...state,
            user: null,
            access_token: null,
            isLoggedIn: false,
        };        
        default:
            return state;
        }
}