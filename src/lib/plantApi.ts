import axios from "axios";

const PLANT_ID_API_KEY = "YOUR_API_KEY";  // Replace with your actual API key

export const identifyPlantDisease = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("images", imageFile);
    formData.append("api_key", PLANT_ID_API_KEY);

    try {
        const response = await axios.post("https://api.plant.id/v2/identify", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error identifying plant disease:", error);
        return null;
    }
};
