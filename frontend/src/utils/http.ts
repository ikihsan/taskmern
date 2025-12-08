import axios from 'axios';

interface ApiErrorShape {
  message?: string;
}

export const extractErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  if (axios.isAxiosError<ApiErrorShape>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
