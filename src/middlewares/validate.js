function validate(schema) {
  return (request, _response, next) => {
    try {
      request.body = schema.parse(request.body);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = validate;
