import { useContext } from "react";
import { AuthContext } from "../../index";


const Policies = () => {
    const { state, dispatch } = useContext(AuthContext);

  // redirect to login if isLoggedIn is false
    if (!state.isLoggedIn) {
        return <Navigate to="/login" />;
    }
    return (<>
            <h1>Policies</h1>
            <p>
                This is the Policies page.
            </p>        
    </>   
   )}

export default Policies;