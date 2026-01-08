const { REACT_APP_API_BASE_URL: API_BASE_URL = "" } =
    (window as any).ENV ?? process.env;

export { API_BASE_URL };
