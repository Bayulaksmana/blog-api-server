import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


export const getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const query = {}
    const cat = req.query.cat
    const author = req.query.author
    const searchQuery = req.query.search
    const sortQuery = req.query.sort
    const featured = req.query.featured
    if (cat) {
        query.category = cat
    }
    if (searchQuery) {
        query.title = { $regex: searchQuery, $options: "i" }
    }
    if (author) {
        const user = await User.findOne({ username: author }).select("_id")
        if (!user) {
            return res.status(404).json("No Post Found!")
        }
        query.user = user._id
    }
    if (sortQuery) {
        query.category = cat
    }
    let sortObj = { createdAt: -1 }
    if (sortQuery) {
        switch (sortQuery) {
            case "terbaru":
                sortObj = { createdAt: -1 }
                break;
            case "terdahulu":
                sortObj = { createdAt: 1 }
                break;
            case "terpopuler":
                sortObj = { visit: -1 }
                break;
            case "trending":
                sortObj = { visit: 1 }
                query.createdAt = {
                    $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
                }
                break;
            default:
                break;
        }
    }
    if (featured) {
        query.isFeatured = true;
    }
    const posts = await Post.find(query).populate("user", "username").sort(sortObj).limit(limit).skip((page - 1) * limit);
    const totalPost = await Post.countDocuments()
    const hasMore = page * limit < totalPost;
    res.status(200).json({ posts, hasMore, sortObj })
}
export const getPost = async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).populate("user", "username image email");
    res.status(200).json(post)
}
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.params.id }).populate("user", "username image email");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Failed to get post by ID", error: err.message });
    }
};

export const createPost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const user = await User.findOne({ clerkUserId })
    let slug = req.body.title.replace(/ /, "-").toLowerCase()
    let existingPost = await Post.findOne({ slug })
    let counter = 2;
    while (existingPost) {
        slug = `${slug}-${counter}`
        existingPost = await Post.findOne({ slug })
        counter++;
    }
    const newPost = new Post({ user: user._id, slug, ...req.body });
    const post = await newPost.save()
    res.status(200).json("Post has been crated.." && post)
}
export const deletePost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const role = req.auth().sessionClaims?.metadata?.role || "user"
    if (role === "admin") {
        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json("Post Has Been Deleted!!!")
    }
    const user = await User.findOne({ clerkUserId })
    const deletedPost = await Post.findOneAndDelete({
        _id: req.params.id,
        user: user._id
    })
    res.status(200).json("Post Has Been Deleted!!!", deletedPost)
}
export const updatePost = async (req, res) => {
    try {
        const clerkUserId = req.auth().userId;
        const role = req.auth().sessionClaims?.metadata?.role || "user";
        // Jika admin, izinkan update tanpa batasan user
        if (role === "admin") {
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        title: req.body.title,
                        category: req.body.category,
                        desc: req.body.desc,
                        img: req.body.img,
                        content: req.body.content,
                    },
                },
                { new: true }
            );
            if (!updatedPost) return res.status(404).json({ message: "Post not found" });
            return res.status(200).json(updatedPost);
        }
        // Jika user biasa, hanya izinkan update milik sendiri
        const user = await User.findOne({ clerkUserId });
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        const updatedPost = await Post.findOneAndUpdate(
            { _id: req.params.id, user: user._id },
            {
                $set: {
                    title: req.body.title,
                    category: req.body.category,
                    desc: req.body.desc,
                    img: req.body.img,
                    content: req.body.content,
                },
            },
            { new: true }
        );

        if (!updatedPost) return res.status(404).json({ message: "Post not found or not yours" });

        return res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

export const featurePost = async (req, res) => {
    const clerkUserId = req.auth().userId;
    const postId = req.body.postId
    if (!clerkUserId) {
        res.status(401).json("Not Authenticated User")
    }
    const role = req.auth().sessionClaims?.metadata?.role || "user"
    if (role !== "admin") {
        return res.status(403).json("You can feature this story!")
    }
    const post = await Post.findById(postId)
    const isFeatured = post.isFeatured
    const updatePost = await Post.findByIdAndUpdate(postId, { isFeatured: !isFeatured }, { new: true })
    res.status(200).json("Story up to featured", updatePost)
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



