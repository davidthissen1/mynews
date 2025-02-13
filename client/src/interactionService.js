export const logInteraction = async (articleUrl, action) => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5501/api/interactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ articleUrl, action }),
        });

        if (!response.ok) {
            console.error("Failed to log interaction");
        }
    } catch (err) {
        console.error("Error:", err);
    }
};
