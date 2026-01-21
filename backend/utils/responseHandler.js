export const sendSuccess = (response, statusCode, message, data) => {
  const statusCodes = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
  };

  response.status(statusCode).json({
    status: {
      code: statusCode,
      message: message || statusCodes[statusCode] || 'Success',
    },
    data: data,
  });
};

export const sendError = (response, statusCode, message) => {
  response.status(statusCode).json({
    status: {
      code: statusCode,
      message: message || 'Error',
    },
    error: message,
  });
};
