import { Navigate } from "react-router-dom";
const Protected = ({ children }) => {
    const localData = localStorage.getItem('userToken');
    if (!localData) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
export default Protected;