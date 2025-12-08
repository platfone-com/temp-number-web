export function useWlApi() {
  async function request() {
    return { data: null, error: null, headers: null }
  }
  const get = request,
    post = request,
    put = request,
    del = request
  return { request, get, post, put, del }
}
