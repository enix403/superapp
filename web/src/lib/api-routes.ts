import ky, { HTTPError } from "ky";
import { getAuthState } from "@/stores/auth-store";
import { unslashStart, unslashEnd } from "./utils";

export const API_BASE_URL: string = "http://localhost:3001";

if (!API_BASE_URL) {
  throw new Error("Env variable `NEXT_PUBLIC_API_URL` not set");
}

export class ApiReplyError extends HTTPError {
  constructor(
    parent: HTTPError,
    public readonly errorMessage: string,
    public readonly errorCode: string
  ) {
    super(parent.response, parent.request, parent.options);
    this.name = "ApiReplyError";
    this.message = errorMessage;
  }

  public static check(error: any): error is ApiReplyError {
    return error instanceof ApiReplyError;
  }

  public static getCode(error: any) {
    if (error instanceof ApiReplyError) {
      return error.errorCode;
    }
    return "unset";
  }
}

export const apiConn = ky.extend({
  prefixUrl: unslashEnd(API_BASE_URL),
  timeout: false,
  hooks: {
    beforeRequest: [
      (request) => {
        let { token } = getAuthState();
        if (token) {
          request.headers.set("Authorization", `Bearer: ${token}`);
        }
        return request;
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;

        let isApiReplyError = false;
        let reply: any = null;

        if (response && response.body) {
          reply = await response.json();
          if (reply["isApiReplyError"] === true) {
            isApiReplyError = true;
          }
        }

        if (isApiReplyError) {
          const { errorMessage, errorCode } = reply!;
          return new ApiReplyError(error, errorMessage, errorCode);
        }

        return error;
      },
    ],
  },
});


function decl<
  UrlT extends string | ((...args: UrlArgs) => string),
  UrlArgs extends any[],
  FuncArgs extends any[],
  FuncRet
>({
  url,
  invoke,
}: {
  url: UrlT;
  invoke: (url: UrlT, ...args: FuncArgs) => FuncRet;
}) {
  return async (...args: FuncArgs): Promise<any> => {
    try {
      return await invoke(url, ...args);
    } catch (e) {
      console.log("API-CALL-ERR: Request failed", e);
      throw e;
    }
  };
}

function toUrl<UrlT extends string | ((...args: any) => string)>(
  url: UrlT,
  args: MaybeParameters<UrlT>
) {
  let urlString = typeof url === "string" ? url : url(...args);
  urlString = unslashStart(urlString);
  return urlString;
}

type MaybeParameters<T> = T extends (...args: infer R) => any ? R : [];

function jsonDecl<UrlT extends string | ((...args: any) => string)>(
  url: UrlT,
  opts?: { method?: string }
) {
  return decl({
    url,
    invoke: (url, ...args: MaybeParameters<UrlT>) => {
      return apiConn(toUrl(url, args), {
        method: opts?.method ?? "GET",
      }).json<any>();
    },
  });
}

function payloadDecl<UrlT extends string | ((...args: any) => string)>(
  url: UrlT,
  opts?: { method?: string }
) {
  return decl({
    url,
    invoke: (url, payload: any, ...args: MaybeParameters<UrlT>) => {
      return apiConn(toUrl(url, args), {
        method: opts?.method ?? "POST",
        json: payload,
      }).json<any>();
    },
  });
}

function uploadDecl<UrlT extends string | ((...args: any) => string)>(
  url: UrlT,
  opts?: {
    method?: string;
    key?: string;
  }
) {
  const key = opts?.key ?? "file";

  return decl({
    url,
    invoke: (url, file: File, ...args: MaybeParameters<UrlT>) => {
      const formData = new FormData();
      formData.set(key, file);

      return apiConn(toUrl(url, args), {
        method: opts?.method ?? "POST",
        body: formData,
      }).json<any>();
    },
  });
}

/* ------------------------ */

function wq<Q = string | Record<string, any> | URLSearchParams>(
  template: TemplateStringsArray
) {
  let url = template.join("");
  return (queryParams?: Q) => {
    let query = "";

    if (queryParams) {
      if (typeof queryParams === "string") {
        query = "?" + queryParams;
      } else {
        const urlSearchParams =
          queryParams instanceof URLSearchParams
            ? queryParams
            : new URLSearchParams(queryParams);

        query = "?" + urlSearchParams.toString();
      }
    }

    return url + query;
  };
}

/* ------------------------ */

// prettier-ignore
export const apiRoutes = {
  /* ========================== */
  /* ========== Auth ========== */
  /* ========================== */
  signUp: payloadDecl(`/auth/sign-up`),
  verifyEmail: payloadDecl(`/auth/verify`),
  login: payloadDecl(`/auth/login`),
  getMe: jsonDecl(`/auth/me`),
  forgetPasswordInit: payloadDecl(`/auth/forget-password/init`),
  resetPasswordCheck: payloadDecl(`/auth/forget-password/check`),
  resetPassword: payloadDecl(`/auth/forget-password/set`),

  /* ========================== */
  /* ========== Plan ========== */
  /* ========================== */
  getPlans: jsonDecl(`/plan/all`),
  generatePlan: payloadDecl(`/plan/generate`),
  getPlan: jsonDecl((planId: string) => `/plan/${planId}`),
  updatePlan: payloadDecl((planId: string) => `/plan/${planId}`),
  updatePlanCanvas: payloadDecl((planId: string) => `/plan/canvas/${planId}`),

  /* ========================== */
  /* ========== Plan ========== */
  /* ========================== */
  getUsers: jsonDecl(wq`/users`),
  getUser: jsonDecl((userId: string) => `/users/${userId}`),
  updateUser: payloadDecl((userId: string) => `/users/${userId}`, { method: "PATCH" }),
  deleteUser: jsonDecl((userId: string) => `/users/${userId}`, { method: "DELETE" }),
  deleteUsersBatch: payloadDecl(`/users/batch-delete`, { method: "DELETE" }),

} as const;

if (typeof window !== "undefined") {
  // @ts-ignore
  window.apiConn = apiConn;
  // @ts-ignore
  window.apiRoutes = apiRoutes;
}