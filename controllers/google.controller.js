import admin from "firebase-admin"
import serviceAccountKey from "../blogapp-f412c-firebase-adminsdk-fbsvc-0147140c28.json" assert{type: "json"}
import { getAuth } from "firebase-admin/auth"

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
    return username
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

export const googleAuth = async (req, res) => {
    let { access_token } = req.body
    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {
            let { email, name, picture } = decodedUser
            picture = picture.replace("s96-c", "s384-c")
            let user = await userProfile.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                return u || null
            })
                .catch(err => {
                    return res.status(500).json({ "error": err.message })
                })
            if (user) {
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was signed up google. Please Login with Password to access the account" })
                }
            }
            else {
                let username = await generateUsername(email)
                user = new userProfile({
                    personal_info: { fullname: name, email, username },
                    google_auth: true
                })
                await user.save().then((u) => {
                    user = u
                })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message })
                    })
            }
            return res.status(200).json(formatDatatoSend(user))
        })
        .catch(err => {
            return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other Google Account" })
        })
}