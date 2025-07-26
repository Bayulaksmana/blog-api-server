import Kampus from "../models/kampus.model.js";
import universitasModel from "../models/universitas.model.js";

export const getUniversitas = async (req, res) => {
    try {
        const keyword = "ithb"
        const response = await fetch(`https://api-pddikti.ridwaanhall.com/search/pt/${encodeURIComponent(keyword)}`);
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from API" });
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return res.status(500).json({ error: "Invalid content-type response" });
        }
        const data = await response.json();
        const kampusArray = data;

        if (!Array.isArray(kampusArray)) {
            return res.status(500).json({ error: "Data dari API tidak sesuai format array." });
        }

        const cleanData = kampusArray.map((item) => ({
            id_pt: item.id,
            kode: item.kode,
            nama: item.nama,
            nama_singkat: item.nama_singkat || "", // bisa default ""
        }));

        console.log("Simpan data pertama:", cleanData[0]);

        const savedData = await Kampus.insertMany(cleanData); // sesuaikan dengan struktur respons
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUniversitasId = async (req, res) => {
    try {
        const kampusList = await Kampus.find({});
        if (!kampusList || kampusList.length === 0) {
            return res.status(404).json({ error: "Tidak ada kampus ditemukan" });
        }
        const detailList = await Promise.all(
            kampusList.map(async (kampus) => {
                try {
                    const response = await fetch(`https://api-pddikti.ridwaanhall.com/pt/detail/${encodeURIComponent(kampus.id_pt)}`);
                    if (!response.ok) return null;
                    const contentType = response.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) return null;
                    const data = await response.json();
                    if (typeof data !== "object" || data === null || Array.isArray(data)) {
                        console.warn("Data bukan objek:", data);
                        return null;
                    }
                    const kampusDataArray = Array.isArray(data) ? data : [data];
                    const cleanData = kampusDataArray.map((item) => ({
                        id_pt: item.id_pt,
                        kelompok: item.kelompok,
                        pembina: item.pembina,
                        id_sp: item.id_sp,
                        kode_pt: item.kode_pt,
                        email: item.email,
                        no_tel: item.no_tel,
                        no_fax: item.no_fax,
                        website: item.website,
                        alamat: item.alamat,
                        nama_pt: item.nama_pt,
                        nm_singkat: item.nm_singkat,
                        kode_pos: item.kode_pos,
                        provinsi_pt: item.provinsi_pt,
                        kab_kota_pt: item.kab_kota_pt,
                        kecamatan_pt: item.kecamatan_pt,
                        lintang_pt: item.lintang_pt,
                        bujur_pt: item.bujur_pt,
                        tgl_berdiri_pt: item.tgl_berdiri_pt,
                        tgl_sk_pendirian_sp: item.tgl_sk_pendirian_sp,
                        sk_pendirian_sp: item.sk_pendirian_sp,
                        status_pt: item.status_pt,
                        akreditasi_pt: item.akreditasi_pt,
                        status_akreditasi: item.status_akreditasi
                    }));
                    await universitasModel.insertMany(cleanData, { ordered: false });
                    return cleanData;
                } catch (err) {
                    console.error(`Gagal fetch kampus ${kampus.nama}:`, err.message);
                    return null;
                }
            })
        );
        const validResults = detailList.flat().filter(Boolean);
        return res.json(validResults);
    } catch (error) {
        console.error("ERROR:", err.message);
        return res.status(500).json({ error: "Terjadi kesalahan saat mengambil data kampus" });
    }
}