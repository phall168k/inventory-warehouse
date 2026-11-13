import { useCookie, useRuntimeConfig } from '#app'
import type { NitroFetchOptions } from 'nitropack'

export type ApiOptions = NitroFetchOptions<string> & {
  responseType?: 'json'
}

/**
 * Fetch JSON from the configured API within a Nuxt context.
 * Set authOnly to false for public requests such as sign-in.
 * Fetch errors propagate unchanged so callers can handle status and error.data.
 */
export const useApi = <T = unknown>(
  url: string,
  options: ApiOptions = {},
  authOnly: boolean = true,
): Promise<IResponse<T>> => {
  const config = useRuntimeConfig()
  const headers = new Headers(options.headers)

  if (authOnly && !headers.has('Authorization')) {
    const auth = useCookie<IAuthResponse | null>('auth')

    if (auth.value?.accessToken) {
      headers.set('Authorization', `Bearer ${auth.value.accessToken}`)
    }
  }

  return $fetch<IResponse<T>>(url, {
    baseURL: config.public.NUXT_PUBLIC_API,
    ...options,
    headers,
  })
}
