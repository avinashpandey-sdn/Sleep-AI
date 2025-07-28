import {API_BASE_URL} from './baseUrl';

export const APIS = {
  REGISTER: `${API_BASE_URL}/auth-service/auth/sign-up`,
  LOGIN: `${API_BASE_URL}/auth-service/auth/login`,
  LOGAPI: `${API_BASE_URL}/logs-service/logs/login-logs`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth-service/auth/forgot-password-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_OTP: `${API_BASE_URL}/auth-service/auth/vertify-otp`,
  VERIFY_FORGET_OTP: `${API_BASE_URL}/auth-service/auth/verify-forgotpassword-otp`,
  SENT_OTP: `${API_BASE_URL}/auth-service/auth/sent-otp`,
  RESET_PASSWORD_OTP: `${API_BASE_URL}/auth-service/auth/reset-password-otp`,
  GET_QUESTINER_LIST: `${API_BASE_URL}/questionnaire-service/questionnaire/list-questions`,
  POST_QUESTINER_LIST_ANSWER: `${API_BASE_URL}/questionnaire-service/questionnaire/add-patient-assessment`,
  GET_USER_PROFILE_DATA: `${API_BASE_URL}/auth-service/auth/get-user`,
  POST_USER_PROFILE_DATA: `${API_BASE_URL}/auth-service/auth/add-update-user-profile`,
  SOCIAL_LOGIN: `${API_BASE_URL}/auth-service/auth/login-with-google`,
  SOCIAL_LOGIN_APPLE: `${API_BASE_URL}/auth-service/auth/login-with-apple`,
  GET_SUBSCRIPTION_PLAN :`${API_BASE_URL}/subscription-service/subscription/all-plan-list`,
  CREATE_PAYMENT_INTENT :`${API_BASE_URL}/subscription-service/subscription/create-payment-intent`,
  SAVE_PAYMENT_DATA :`${API_BASE_URL}/subscription-service/subscription/save-transaction`,
  GET_ALL_TRANSACTIONS :`${API_BASE_URL}/subscription-service/subscription/get-all-transaction-list`,
};
