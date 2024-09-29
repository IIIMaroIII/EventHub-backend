const errorMessages = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  500: 'Server error',
};

export const HttpError = (status = 500, message = errorMessages[status]) => {
  const err = new Error(message);
  err.status = status;
  return err;
};
