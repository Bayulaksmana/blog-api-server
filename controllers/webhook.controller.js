import { Webhook } from "svix";
import User from "../models/user.model.js";

export const clerkWebHook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const payload = req.body;
    const headers = req.headers;
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        return res.status(400).send({ message: "❌ Weebhook verification failed" });
    }
    console.log("Webhook Event:", evt);

    if (evt.type === "user.created") {
        const data = evt.data;

        const newUser = new User({
            clerkUserId: data.id,
            username: data.username || data.email_addresses[0].email_address,
            email: data.email_addresses[0].email_address,
            image: data.profile_image_url,
            fname: data.first_name,
            lname: data.last_name,
            // phone: data.phone_numbers[0],
            // password: data.passkey
        })
        await newUser.save();
        console.log("✅ User saved to DB:", newUser.username);
    }
    return res.status(200).json({ message: "✅ Webhook received and processed." });
}
