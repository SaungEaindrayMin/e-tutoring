import Configuration from "./configuration";
import Resources from "./resources";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

class DataServices {
  constructor() {
    this.config = new Configuration();
    this.resources = new Resources();
  }

  async authorize(data, serviceName) {
    return fetch(this.resources.BACKEND_SIDE_BASE_URL + serviceName, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // if (!response.ok) {
        // 	// this.handleResponseError(response);
        // }

        return response.json();
      })
      .catch((error) => {
        this.handleError(error);

        return error;
      });
  }

  async authorizePUT(data, serviceName) {
    const url = this.resources.BACKEND_SIDE_BASE_URL + serviceName;

    const makeRequest = async () => {
      return fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    };

    try {
      let response = await makeRequest();

      if (response.status === 401) {
        response = await fetch(url, {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) this.handleResponseError(response);
      return await response.json();
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async retrievePOST(data, serviceName) {
    const url = this.resources.BACKEND_SIDE_BASE_URL + serviceName;
    try {
      let token = this.getTokenFromCookie();
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async retrieve(serviceName, serviceAction) {
    const url =
      this.resources.BACKEND_SIDE_BASE_URL + serviceName + serviceAction;

    const makeRequest = async (token) => {
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    };

    try {
      let token = this.getTokenFromCookie();
      let response = await makeRequest(token);

      const data = await response.json();

      if (!response.ok) {
        this.handleResponseError(response);
        return {
          success: false,
          status: response.status,
          message: data.message,
          data,
        };
      }

      return data;
    } catch (error) {
      console.error("Error during data retrieval:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async retrievePOSTFormData(data, serviceName) {
    const url = this.resources.BACKEND_SIDE_BASE_URL + serviceName;

    const makeRequest = async (token) => {
      return fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: data,
      });
    };

    try {
      let token = this.getTokenFromCookie();
      let response = await makeRequest(token);

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async retrievePUT(data, serviceName) {
    const url = this.resources.BACKEND_SIDE_BASE_URL + serviceName;

    const makeRequest = async (token) => {
      return fetch(url, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
    };

    try {
      let token = this.getTokenFromCookie();
      let response = await makeRequest(token);

      if (response.status === 401) {
        const newToken = await this.refreshToken();
        if (!newToken) {
          this.removeTokenCookie();
          window.location.href = "/login";
          return null;
        }
        response = await makeRequest(newToken);
      }

      // if (!response.ok) this.handleResponseError(response);

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async retrievePATCH(data, serviceName) {
    const url = this.resources.BACKEND_SIDE_BASE_URL + serviceName;

    const makeRequest = async (token) => {
      return fetch(url, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
    };

    try {
      let token = this.getTokenFromCookie();
      let response = await makeRequest(token);

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async retrieveDELETE(serviceName, serviceAction) {
    const url =
      this.resources.BACKEND_SIDE_BASE_URL + serviceName + serviceAction;

    const makeRequest = async (token) => {
      return fetch(url, {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    };

    try {
      let token = this.getTokenFromCookie();
      let response = await makeRequest(token);

      if (!response.ok) this.handleResponseError(response);

      return await response.json();
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async retrieveBody(data, url) {
    const fullUrl = this.resources.BACKEND_SIDE_BASE_URL + url;

    const makeRequest = async (token) => {
      return fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      });
    };

    try {
      let token = this.getTokenFromCookie();
      let response = await makeRequest(token);

      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

      return await response.json();
    } catch (error) {
      return null;
    }
  }

  getTokenFromCookie() {
    const token = Cookies.get(this.config.COOKIE_NAME_TOKEN);
    if (!token) {
    }
    return token;
  }

  removeTokenCookie() {
    Cookies.remove(this.config.COOKIE_NAME_TOKEN, { path: "/" });
  }

  async handleError(error) {
    console.error("API Error:", error);

    let message = "Something went wrong";

    if (error?.message) {
      message = error.message;
    }
    toast.error(message);
  }

  handleResponseError = async (response) => {
    let errorData;

    try {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }
    } catch (err) {
      errorData = { message: "Unknown error occurred" };
    }

    const message =
      errorData?.message ||
      errorData?.error ||
      `Request failed with status ${response.status}`;

    toast.error(message);

    return errorData;
  };
}
export default DataServices;