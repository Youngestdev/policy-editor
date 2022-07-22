export const initialState = {
    provider: localStorage.getItem("provider") || null,
    access_token: localStorage.getItem("access_token") || null,
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    loggedInTime: localStorage.getItem("loggedInTime") || null
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            // set the user and access_token to the localstorage
            localStorage.setItem("access_token", action.payload.access_token);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("loggedInTime", new Date());
            localStorage.setItem("provider", action.provider)
        return {
            ...state,
            access_token: action.payload.access_token,
            isLoggedIn: true,
            loggedInTime: new Date()
        };
        case "LOGOUT":
            // clear the localstorage
            localStorage.clear();
        return {
            ...state,
            access_token: null,
            isLoggedIn: false,
        };        
        default:
            return state;
        }
}