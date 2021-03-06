import { useState } from "react";
import axios from "axios";

const useRequest = (
  url,
  {
    method = "GET",
    data: body,
    onSuccess = () => {},
    onFailure = () => {},
    ...options
  }
) => {
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const doRequest = async (extraProps = {}) => {
    setLoading(true);

    try {
      const response = await axios({
        url,
        method,
        data: { ...body, ...extraProps },
        ...options,
      });

      setData(response.data);
      onSuccess(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
      onFailure();
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
