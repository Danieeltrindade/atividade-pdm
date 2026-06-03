const prisma = require("../lib/prisma");
const HttpError = require("../utils/httpError");

async function listCategories(request, response, next) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { isDefault: true },
          { userId: request.user.id },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });

    return response.json({ categories });
  } catch (error) {
    return next(error);
  }
}

async function createCategory(request, response, next) {
  try {
    const { name, color, icon } = request.body;

    const category = await prisma.category.create({
      data: {
        name,
        color,
        icon,
        userId: request.user.id,
      },
    });

    return response.status(201).json({ category });
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(request, response, next) {
  try {
    const { id } = request.params;
    const { name, color, icon } = request.body;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category || category.userId !== request.user.id) {
      throw new HttpError(404, "Categoria nao encontrada");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, color, icon },
    });

    return response.json({ category: updatedCategory });
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(request, response, next) {
  try {
    const { id } = request.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new HttpError(404, "Categoria nao encontrada");
    }

    if (category.isDefault || !category.userId) {
      throw new HttpError(403, "Categoria padrao nao pode ser removida");
    }

    if (category.userId !== request.user.id) {
      throw new HttpError(403, "Categoria nao encontrada");
    }

    await prisma.category.delete({
      where: { id },
    });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
