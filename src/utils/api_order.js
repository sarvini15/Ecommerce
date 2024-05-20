import axios from "axios";

const url = "http://localhost:5000";

export const getOrders = async (token) => {
  const res = await axios.get(`${url}/orders`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return res.data;
};

export const addNewOrder = async (data) => {
  const response = await axios.post(
    `${url}/orders`, // url of the POST API
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

// update status only
export const updateOrder = async (data) => {
  const response = await axios.put(
    `${url}/orders/${data._id}`,
    JSON.stringify(data),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${url}/orders/${id}`);
  return response.data;
};
