const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const HttpError = require("../utils/httpError");
const { signAuthToken } = require("../utils/jwt");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(request, response, next) {
  try {
    const { name, email, password } = request.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpError(409, "Email ja cadastrado");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    const token = signAuthToken(user.id);

    return response.status(201).json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return next(error);
  }
}

async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpError(401, "Credenciais invalidas");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new HttpError(401, "Credenciais invalidas");
    }

    const token = signAuthToken(user.id);

    return response.json({
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return next(error);
  }
}

async function me(request, response) {
  return response.json({
    user: request.user,
  });
}

module.exports = {
  login,
  me,
  register,
};
