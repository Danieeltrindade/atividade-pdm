const prisma = require("../lib/prisma");
const HttpError = require("../utils/httpError");
const { verifyAuthToken } = require("../utils/jwt");

async function authMiddleware(request, _response, next) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpError(401, "Token nao informado");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Token invalido");
    }

    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new HttpError(401, "Usuario nao encontrado");
    }

    request.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authMiddleware;
