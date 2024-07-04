import axios from "axios";
import { BASE_URL } from "../../utils/url";
import getUserFromStorage from "../../utils/getUserFromStorage";

const token = getUserFromStorage();

export const addTransactionAPI = async ({
  type,
  amount,
  date,
  category,
  description,
}) => {
  const response = await axios.post(
    `${BASE_URL}/transaction/create`,
    {
      type,
      amount,
      date,
      category,
      description,
    },
    {
      headers: {
        Authentication: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// export const updateCategoryAPI = async ({ name, type, id }) => {
//     const response = await axios.put(
//       `${BASE_URL}/categories/update/${id}`,
//       {
//         name,
//         type,
//         id
//       },
//       {
//         headers: {
//           Authentication: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   };

//   export const deleteCategoryAPI = async (id) => {
//     const response = await axios.delete(
//       `${BASE_URL}/categories/delete/${id}`,

//       {
//         headers: {
//           Authentication: `Bearer ${token}`,
//         },
//       }
//     );
//     return response.data;
//   };

export const listTransactionsAPI = async ({startDate, endDate, type, category}) => {
  const response = await axios.get(`${BASE_URL}/transaction/lists`, {
    params: {startDate, endDate, type, category},
    headers: {
      Authentication: `Bearer ${token}`,
    },
  });
  return response.data;
};
