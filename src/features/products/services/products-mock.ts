import { AxiosError } from 'axios';

/**
 * Dev-only products API mock.
 * `'off'`     → real dummyjson
 * `'400'`     → fail with HTTP 400
 * `'timeout'` → wait then fail like axios timeout
 */
export type ProductsMockMode = 'off' | '400' | 'timeout';

export const PRODUCTS_API_MOCK: ProductsMockMode = 'off';

/** Matches `apiClient` timeout. Lower this if you don't want to wait 15s while testing. */
const MOCK_TIMEOUT_MS = 5_000;

export async function applyProductsMock(mode: ProductsMockMode, signal?: AbortSignal): Promise<void> {
  if (mode === 'off') return;

  if (mode === 'timeout') {
    await new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        reject(
          new AxiosError(`timeout of ${MOCK_TIMEOUT_MS}ms exceeded`, AxiosError.ECONNABORTED)
        );
      }, MOCK_TIMEOUT_MS);

      signal?.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new AxiosError('canceled', AxiosError.ERR_CANCELED));
      });
    });
  }

  throw new AxiosError(
    'Request failed with status code 400',
    AxiosError.ERR_BAD_REQUEST,
    undefined,
    undefined,
    {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Mocked 400' },
      headers: {},
      config: {} as never,
    }
  );
}
