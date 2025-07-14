import {use} from 'react';
import {AuthContext} from "../contexts/AuthContext.jsx";


const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;