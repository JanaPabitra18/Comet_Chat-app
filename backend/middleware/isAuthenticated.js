 import jwt from 'jsonwebtoken';
//import { TokenData } from 'path-to-regexp';
const isAuthenticated = async (req, res, next) => {
    try {
       // console.log("In isAuthenticated middleware");
         console.log('Cookies:', req.cookies);  
        const token = req.cookies.token ;
       // console.log(token)
        if (!token){
        return res.status(401).json({ message: 'No token, authorization denied' });
        };
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
      //  console.log(decoded);
        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        };
        req.id = decoded.userId;
        //req.name=decoded.username; // Add user info to request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
export default isAuthenticated;
//    try {
//          const token = req.cookie.token ;
//         if (!token){
//         return res.status(401).json({ message: 'No token, authorization denied' });
//         }
//         const decoded=  jwt.verify(token,process.env.JWT_SECRET);
//         console.log(decoded);
//         if (!decoded) {
//             return res.status(401).json({ message: 'Token is not valid' });
//         };
//         req.id = decoded.userId; // Add user info to request object
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };
// export default isAuthenticated;

// // --- IGNORE ---
// const req ={
//     id:"",

// }
// req.id="sdfjsdfjsdfj";