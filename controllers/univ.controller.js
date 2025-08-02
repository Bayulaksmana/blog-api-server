import Kampus from "../models/kampus.model.js";
import Universitas from "../models/universitas.model.js";

export const getUniversitas = async (req, res) => {
    const data = await Kampus.find()
    return res.status(200).json(data)
}

export const getUniversitasId = async (req, res) => {
    // const data = await Universitas.find()
    // return res.status(200).json(data)
    try {
        const rawData = await Universitas.find({
            website: { $exists: true, $ne: "" },
            nm_singkat: { $exists: true, $ne: "" },
            kab_kota_pt: /bandung/i, // cocokkan string yang mengandung 'bandung' tanpa case sensitive
            provinsi_pt: { $regex: /^prov\. jawa barat$/i },
        });
        const uniqueMap = new Map();
        for (const item of rawData) {
            if (!uniqueMap.has(item.nm_singkat)) {
                uniqueMap.set(item.nm_singkat, item);
            }
        }

        // Ambil hasil unik
        const uniqueData = Array.from(uniqueMap.values());

        // Acak hasil
        const shuffled = uniqueData.sort(() => Math.random() - 0.5);
        return res.status(200).json(shuffled);
    } catch (error) {
        console.error("Gagal mengambil data universitas:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};




