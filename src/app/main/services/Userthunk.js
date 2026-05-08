import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchCurrentCustomerInvoice = createAsyncThunk('cart/hash', async (obj) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API}customer-current-invoice?hash=${obj.hash}&id=${obj.id}`,
    {
      headers: {
        'Content-Type': 'application/json', // Adjust the content type based on your API requirements
        Authorization: process.env.REACT_APP_API_AUTH,
      },
    }
  );

  return response.data;
});

export { fetchCurrentCustomerInvoice };
export default fetchCurrentCustomerInvoice;
