import Kampus from "../models/kampus.model.js";
import universitasModel from "../models/universitas.model.js";

export const getUniversitas = async (req, res) => {
    const query = {}
    const kampus = await Kampus.find(query)
    console.log(kampus)
    res.status(200).json(kampus)
};

export const getUniversitasId = async (req, res) => {
    try {
        const kampusList = await Kampus.find({});
        if (!kampusList || kampusList.length === 0) {
            return res.status(404).json({ error: "Tidak ada kampus ditemukan" });
        }
        console.log(kampusList)
        const keyword = "dX1scaoJDscY9D4TcMnO6qrj2bpNTyBlnrkW_ik3XvJXLUUIedfNHTMZxfYVOudCdgpK1A=="
        const detailList = await Promise.all(
            kampusList.map(async (kampus) => {
                try {
                    const response = await fetch(`https://api-pddikti.ridwaanhall.com/pt/detail/${encodeURIComponent(keyword)}`);
                    if (!response.ok) return null;
                    const contentType = response.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) return null;
                    const data = await response.json();
                    if (typeof data !== "object" || data === null || Array.isArray(data)) {
                        console.warn("Data bukan objek:", data);
                        return null;
                    }
                    const kampusDataArray = Array.isArray(data) ? data : [data];
                    // const kampusDataArray = data;
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
                    const savedData = await universitasModel.insertMany(cleanData, { ordered: false });
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