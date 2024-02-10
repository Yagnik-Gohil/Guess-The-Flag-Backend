const generateOtp = () => {
  let otp = Math.floor(100000 + Math.random() * 100000);
  if (['localhost', 'development', 'staging'].includes(process.env.NODE_ENV)) {
    otp = 123456;
  }
  return otp;
};

export default generateOtp;
