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
  SERVICE_SIDEBAR = "sidebar";
  SERVICE_USER_ACTIVITY = "user-activity";
  SERVICE_TUTOR_LIST = "users/lookup";
  SERVICE_ASSIGN_TUTOR = "allocate/assign-student";
  SERVICE_UNASSIGN_TUTOR = "allocate/unassign-tutor";
  SERVICE_ADMIN_DASHBOARD = "dashboard";
  SERVICE_TUTOR_DASHBOARD = "dashboard/tutor";
  SERVICE_STUDENT_STATS = "student-dashboard/stats";
  SERVICE_GET_STUDENT_TUTOR = "allocate/student/";
  SERVICE_STUDENT_WEEKLY_MEETING_STATISTICS =
    "student-dashboard/weekly-meeting-statistics";
  SERVICE_STUDENT_ACTIVITY_TRENDS = "student-dashboard/activity-trends";
  SERVICE_SCHEDULE = "schedule/";
  SERVICE_RECENT_MESSAGE = "student-dashboard/recent-messages";
}

export default Configuration;
