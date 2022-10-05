import axios from "axios";

export type Request<TVariables, TResponse> = {
  type: "GET" | "POST";
  url: (variables: TVariables) => string;
  headers?: (variables: TVariables) => Record<string, string>;
  body?: (variables: TVariables) => unknown;
  urlParams?: (
    variables: TVariables
  ) => Record<string, string | number | boolean>;
  responseParser: (response: unknown) => TResponse;
};

export type ResponseOf<TRequest> = TRequest extends Request<any, infer R>
  ? R
  : never;

export const buildRequest = <TRequest extends Request<any, any>>(
  request: TRequest
): TRequest => request;

export async function runRequest<TVariables, TResponse>(
  request: Request<TVariables, TResponse>,
  variables: TVariables
): Promise<TResponse> {
  const url = request.url(variables);
  const headers = request.headers?.(variables);
  const body = request.body?.(variables);
  const params = request.urlParams?.(variables);
  switch (request.type) {
    case "GET":
      return request.responseParser(
        (
          await axios.get(url, {
            headers,
            params,
          })
        ).data
      );
    case "POST":
      return request.responseParser(
        await axios.post(url, body, {
          headers,
          params,
        })
      );
  }
}
