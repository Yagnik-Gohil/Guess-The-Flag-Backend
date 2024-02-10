const validate = (payload: any, schemaKeys: any) => {
  const { error } = schemaKeys.validate(payload, { abortEarly: false });
  if (error) {
    const message = error.details.map((el: any) => el.message);
    return { error: message };
  }
  return true;
};

export default validate;
