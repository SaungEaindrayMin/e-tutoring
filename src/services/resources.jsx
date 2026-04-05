class Resources {
  APP_NAME = "eTutoring";


  IS_LOCAL = false;

  LOCAL_BASE_URL = "http://localhost:3000/api";
  LOCAL_SOCKET_URL = "http://localhost:3000";

  PROD_BASE_URL = "https://dev-kmd-cms-api.onrender.com/api";
  PROD_SOCKET_URL = "https://dev-kmd-cms-api.onrender.com";

  BACKEND_SIDE_BASE_URL = this.IS_LOCAL ? this.LOCAL_BASE_URL : this.PROD_BASE_URL;
  BACKEND_SIDE_SOCKET_URL = this.IS_LOCAL ? this.LOCAL_SOCKET_URL : this.PROD_SOCKET_URL;
}

export default Resources;
