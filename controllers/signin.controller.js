import bcrypt from "bcrypt"
import userProfile from "../models/user.js";
import jwt from "jsonwebtoken"

const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}
export const getAuthentication = (req, res) => {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email

    let { email, password } = req.body
    if (!email.length) {
        return res.status(403).json({ error: "Email must be entered" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ error: "username invalid format, must be login with email" })
    }
    if (!password.length) {
        return res.status(403).json({ error: "Password must be entered" })
    }
    userProfile.findOne({ "personal_info.email": email }).
        then((user) => {
            if (!user) {
                return res.status(403).json({ "error": "email not found, register donk!" })
            }
            if (!user.google_auth) {

                bcrypt.compare(password, user.personal_info.password, (err, result) => {
                    if (err) {
                        return res.status(403).json({ "error": "Error occured while login please try again" })
                    }
                    if (!result) {
                        return res.status(403).json({ "error": "Incorrect Password donk!" })
                    } else {
                        return res.status(200).json(formatDatatoSend(user))
                    }
                })
            } else {
                return res.status(403).json({ "error": "Account was created using google. Try logging in with google" })
            }
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message })
        })
}