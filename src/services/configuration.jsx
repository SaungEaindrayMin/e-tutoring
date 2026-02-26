class Configuration {
	COOKIE_NAME_TOKEN = "social-token";
    COOKIE_NAME_USER = "social-user";

	SERVICE_NAME = "/v1/";
    SERVICE_USER = "auth/login";
    SERVICE_FORGET_PASSWORD = "auth/forgot-password";
    SERVICE_OTP_VERIFY = "auth/verify-otp";
    SERVICE_RESET_PASSWORD = "auth/reset-password";
    SERVICE_GET_CONVERSATIONS = "conversation";
    SERVICE_GET_MESSAGES = "conversation/messages";
    SERVICE_SEND_MESSAGE = "conversation/send-message";
}

export default Configuration;
