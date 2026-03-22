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
    SERVICE_MESSAGE_STATUS = "conversation/messages/status";
    SERVICE_LOGOUT = "auth/logout";
    SERVICE_USERS = "users";
    SERVICE_SIDEBAR = "sidebar"
    SERVICE_USER_ACTIVITY = "user-activity";
    SERVICE_TUTOR_LIST = "users/lookup"
    SERVICE_ASSIGN_TUTOR = "allocate/assign-student"
    SERVICE_UNASSIGN_TUTOR = "allocate/unassign-student"
}

export default Configuration;
