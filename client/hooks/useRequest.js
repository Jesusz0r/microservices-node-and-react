import { useState } from "react";
import axios from "axios";

const useRequest = (url, { method = "GET", ...options }) => {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const doRequest = async () => {
    setLoading(true);

    try {
      const response = await axios({ url, method, ...options });

      setData(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    doRequest,
    errors,
  };
};

export default useRequest;
