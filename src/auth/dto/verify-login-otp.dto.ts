export class VerifyLoginOtpDto {
  email: string;
  otp: number;
  device_id: string;
  device_type: string;
  firebase_token: string;
  created_at_ip?: string;
  updated_at_ip?: string;
}
