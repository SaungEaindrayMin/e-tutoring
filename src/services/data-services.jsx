import Configuration from "./configuration";
import Resources from "./resourses";

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

  async handleError(error) {
    if (error?.response) {
      try {
        const errorObj = await error.response.json();
      } catch (parseErr) {}
    } else {
    }
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
      errorData = { message: "Unknown error" };
    }

    return errorData;
  };

}
export default DataServices;
