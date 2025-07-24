export const getKotaApi = async (req, res) => {
    try {
        const response = await fetch("https://id.wikipedia.org/api/rest_v1/page/summary/Kota_Kotamobagu");

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from API" });
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return res.status(500).json({ error: "Invalid content-type response" });
        }

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};