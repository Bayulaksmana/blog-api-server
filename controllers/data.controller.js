// import axios from "axios";

// export const postData = async (req, res) => {
//     const url = "https://api.jikan.moe/v4/anime"; // misalnya endpoint anime list

//     try {
//         const { data } = await axios.get(url);
//         // Data sudah dalam format JSON
//         res.json({ data: data.data }); // kirim langsung list anime misalnya
//     } catch (err) {
//         res.status(500).json({ error: err.toString() });
//     }
// };

import axios from "axios";
import * as cheerio from "cheerio";

export const postData = async (req, res) => {
    try {
        const url = "http://10.1.86.28";

        const { data } = await axios.get(url);

        const $ = cheerio.load(data);
        const rows = [];

        $("table tbody tr").each((_, el) => {
            const cols = [];
            $(el).find("td").each((__, td) => {
                cols.push($(td).text().trim());
            });
            rows.push(cols);
        });

        res.json({ data: rows });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
};
