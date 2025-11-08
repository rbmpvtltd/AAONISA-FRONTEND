import { createApiUrl } from "@/util";
import axios from "axios";

 async function getAllStreamIds() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const apiUrl = createApiUrl('/videos/getAllStreamIds'); 

    const { data } = await axios.get(apiUrl, config);

    return data;
  } catch (err: any) {
    console.error('Error fetching video IDs:', err.response?.data || err.message);
    throw err;
  }
}

export { getAllStreamIds };
