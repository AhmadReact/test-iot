import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const fetchCurrentCustomerInvoice = createAsyncThunk('cart/hash', async (obj) => {
  const response = await axios.get(
    `${process.env.REACT_APP_API || '/api/'}customer-current-invoice?hash=${obj.hash}&id=${obj.id}`,
    {
      headers: {
        'Content-Type': 'application/json', // Adjust the content type based on your API requirements
      },
    }
  );

  return response.data;
});

export { fetchCurrentCustomerInvoice };
export default fetchCurrentCustomerInvoice;
