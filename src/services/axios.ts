// eslint-disable-next-line import/named -- False positive
import axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const AXIOS_INSTANCE = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true,
});

// add a second `options` argument here if you want to pass extra options to each generated query
export const axiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({data}) => data);

  // @ts-expect-error -- cancel is not a standard axios method
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type BodyType<BodyData> = BodyData;
export type ErrorType<Error> = AxiosError<Error>;
