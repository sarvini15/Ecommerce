import axios from "axios";

const url= "http://localhost:5000";

export const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    const res = await axios.post(`${url}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  };