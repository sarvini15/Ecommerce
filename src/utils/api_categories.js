import axios from "axios";

import { url } from "./data";

export const getCategories = async () => {
  try {
    const res = await axios.get(`${url}/categories`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const addNewCategory = async (data) => {
  const response = await axios.post(
    `${url}/categories`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return response.data;
};

// update category
export const updateCategory = async (data) => {
  const response = await axios.put(
    `${url}/categories/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return response.data;
};

export const deleteCategory = async (data) => {
  const response = await axios.delete(`${url}/categories/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return response.data;
};
