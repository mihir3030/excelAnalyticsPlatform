import jwt from 'jsonwebtoken'


// generate jet token function
export const generateToken = (userId, res) => {
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn: "3d"}
    )

    // // cookie generate
    // res.cookie("jwt", token, {
    //     maxAge: 7 * 24 * 60 * 60 * 1000,  // MS ,
    //     httpOnly: true,   // prevent JS aattck cross-site,
    //     sameSite: "strict",  // csrf attack
    //     secure: process.env.NODE_ENV !== "development"
    //     // in production cookies only sent to https site not some http
    // }
    // )
    return token
}