import {useState, useCallback} from 'react'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, method = 'GET', formData = null, headers = {}) => {
    setLoading(true)
    try {
      console.log(formData);
      // if (body) {
      //   body = JSON.stringify(body)
      // }

        // headers['Content-Type'] = ' multipart/form-data';
         headers['Accept'] = 'application/json'

      const response = await fetch(url, {method, body: formData, headers})
      const data = await response.json();
      console.log(data.message);
      // console.log(data);
      if (!response.ok) {

        throw new Error(data.message || 'Что-то пошло не так')
      }

      setLoading(false)

      return data;
    } catch (e) {
      setLoading(false)
      console.log(e.message);
      setError(e.message)
      console.log(error);
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])
  return { loading, request, error, clearError }
}