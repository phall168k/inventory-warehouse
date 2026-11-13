
import type { NitroFetchOptions } from 'nitropack';

export type ApiOptions = NitroFetchOptions<string> & {
  responseType?: 'json'
}

export const useApi = async <T = unknown>(
  url: string,
  options: ApiOptions = {},
  authOnly: boolean = true,
): Promise<IResponse<T>> => {
  const config = useRuntimeConfig()
  const { auth, refreshToken, clearAuth } = useAuth()

  const request = (token?: string) => {
    const headers = new Headers(options.headers)

    if (authOnly && token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return $fetch<IResponse<T>>(url, {
      ...options,
      baseURL: config.public.NUXT_PUBLIC_API,
      headers,
    })
  }

  try {
    return await request(auth.value?.accessToken)
  } catch (error: unknown) {
    const status = (error as {
      statusCode?: number
      status?: number
    })?.statusCode ?? (error as {
      status?: number
    })?.status

    if (status !== 401 || !authOnly) {
      throw error
    }

    const newToken = await refreshToken()

    if (!newToken) {
      clearAuth()

      if (import.meta.client) {
        await navigateTo('/login')
      }

      throw error
    }

    // Retry only once with the new token.
    return request(newToken)
  }
}
