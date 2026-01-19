export const sendSuccess = (res, statusCode, message, data) => {
  const statusCodes = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
  };

  res.status(statusCode).json({
    status: {
      code: statusCode,
      message: message || statusCodes[statusCode] || 'Success',
    },
    data: data,
  });
};

export const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    status: {
      code: statusCode,
      message: message || 'Error',
    },
    error: message,
  });
};
