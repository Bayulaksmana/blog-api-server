import bcrypt from "bcrypt"
import userProfile from "../models/user.js";
import { nanoid } from "nanoid"
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
const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameExists = await userProfile.exists({ "personal_info.username": username }).then((result) => result)
    isUsernameExists ? username : ""
    // Part nano untuk menambahkan random character pada username user dengan tujuan keamanan.
    return username
}

export const getAuthentication = (req, res) => {
    let { fullname, email, password } = req.body;
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
    // validasi data field inputan dari frontend
    if (!fullname.length) {
        return res.status(403).json({ error: "Username must be entered" })
    }
    if (fullname.length < 6) {
        return res.status(403).json({ error: "Username must be at least 6 character letters" })
    }
    if (!email.length) {
        return res.status(403).json({ error: "Email must be entered" })
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ error: "E-mail is invalid format, must be @email.com" })
    }
    if (!password.length) {
        return res.status(403).json({ error: "Password must be entered" })
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ error: "Password should be 6 to 20 character long with a numeric, 1 lowercase, 1 uppercase letters" })
    }
    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email)
        let user = new userProfile({
            personal_info: { fullname, email, password: hashed_password, username }
        })
        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
            .catch(err => {
                if (err.code === 11000) {
                    return res.status(500).json({ "error": "username already exist, try again yuk!" })
                }
                return res.status(500).json({ "error": err.message })
            })
    })
}


