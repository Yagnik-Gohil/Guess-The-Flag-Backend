const SUCCESS = {
  DEFAULT: 'Your request is successfully executed',
  FILE_UPLOADED: (file: string) => `${file} Uploaded Successfully`,
  FILE_UPDATED: (file: string) => `${file} Updated Successfully`,
  COMPLETE_VERIFICATION: (type: string) =>
    `OTP Sent to your contact, Please complete ${type} OTP verification`,
  OTP_EXPIRED: (type: string) =>
    `OTP for ${type} expired. we have sent new otp.`,
  SIGN_UP: 'Signup Successful',
  LOGIN: 'Login Successful',
  LOGOUT: 'Logout Successful',
  RECORD_CREATED: (record: string) => `${record} created Successfully`,
  RECORD_UPDATED: (record: string) => `${record} Updated Successfully`,
  RECORD_DELETED: (record: string) => `${record} Deleted Successfully`,
  RECORD_FOUND: (record: string) => `${record} Found Successfully`,
  RECORD_NOT_FOUND: (record: string) => `${record} Not Found`,
  OTP_VERIFIED: 'OTP Verified Successfully',
  EMAIL_SENT: 'Email sent successfully.',
};

const ERROR = {
  MAIL_NOT_SEND: 'Mail not send for this configuration',
  METHOD_NOT_ALLOWED: 'Method Not Allowed.',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  BAD_SYNTAX: 'The request cannot be fulfilled due to bad syntax',
  UNAUTHORIZED: 'Access denied.',
  UNAUTHENTICATED: 'Please log in to access.',
  TOO_MANY_REQUESTS:
    'You have reached the limit. Please try again after sometime.',
  VALIDATION: 'Validation Error!',
  WRONG_CREDENTIALS: 'Wrong Credentials.',
  ALREADY_EXISTS: (text: string) => `${text} already exist`,
  OTP_NOT_VERIFIED: 'OTP is not verified',
  OTP_EXPIRED: 'OTP Expired',
  FILE_TOO_LARGE: (size: string) =>
    `File too large. Maximum file size allowed is ${size}.`,
  ALLOWED_FILE_TYPE: 'Only JPG, JPEG, or PNG files are allowed!',
};

const VALIDATION = {
  PASSWORD_PATTERN:
    'Password must have a capital, small, and special character.',
  COUNTRY_CODE:
    'Country code must start with a plus sign (+) and only contain digits',
  CONTACT_FORMAT: 'Invalid contact number format.',
};

const EMAIL = {
  CONTACT_US: 'Contact Us',
  ACCOUNT_APPROVAL: 'Your account has been approved!',
  VERIFICATION_OTP_SUBJECT: 'Your Verification OTP',
  FORGOT_PASSWORD: 'Password Reset Request',
};

export const CONSTANT = {
  SUCCESS: SUCCESS,
  VALIDATION: VALIDATION,
  ERROR: ERROR,
  EMAIL: EMAIL,
};
