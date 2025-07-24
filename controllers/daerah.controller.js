import ImageKit from "imagekit"
import Daerah from "../models/daerah.models.js"
import userModel from "../models/user.model.js"

export const getDaerah = async (req, res) => {
    const query = {}
    const daerah = await Daerah.find(query).populate("user", "username image email")
    res.status(200).json(daerah)
}

export const createDaerah = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const user = await userModel.findOne({ clerkUserId })
    const newPost = new Daerah({ user: user._id, ...req.body });
    const post = await newPost.save()
    res.status(200).json("Carousel has been add.." && post)
}

export const deleteDaerah = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const user = await userModel.findOne({ clerkUserId })
    const deletedPost = await Daerah.findOneAndDelete({
        _id: req.params.id,
        user: user._id
    })
    res.status(200).json("Dstrict Has Been Deleted!!!", deletedPost)
}
const imagekit = new ImageKit({
    urlEndpoint: process.env.IK_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export const uploadAuth = async (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
}

