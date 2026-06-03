const { ZodError } = require("zod");
const HttpError = require("../utils/httpError");

function errorHandler(error, _request, response, _next) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      error: "Dados inválidos",
      details: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      error: error.message,
      details: [],
    });
  }

  console.error(error);

  return response.status(500).json({
    error: "Erro interno do servidor",
    details: [],
  });
}

module.exports = errorHandler;
