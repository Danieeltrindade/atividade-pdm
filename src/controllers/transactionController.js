const prisma = require("../lib/prisma");
const HttpError = require("../utils/httpError");

function buildPeriodFilters(month, year) {
  const now = new Date();
  const parsedYear = Number(year);
  const parsedMonth = Number(month);
  const filterYear = Number.isInteger(parsedYear) && parsedYear > 0 ? parsedYear : now.getFullYear();
  const filterMonth = Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12 ? parsedMonth : now.getMonth() + 1;

  const startDate = new Date(filterYear, filterMonth - 1, 1);
  const endDate = new Date(filterYear, filterMonth, 1);

  return {
    gte: startDate,
    lt: endDate,
  };
}

async function listTransactions(request, response, next) {
  try {
    const { month, year } = request.query;
    const dateRange = buildPeriodFilters(month, year);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: request.user.id,
        date: dateRange,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return response.json({ transactions });
  } catch (error) {
    return next(error);
  }
}

async function getSummary(request, response, next) {
  try {
    const { month, year } = request.query;
    const dateRange = buildPeriodFilters(month, year);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: request.user.id,
        date: dateRange,
      },
      include: {
        category: true,
      },
    });

    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "INCOME") {
          acc.totalIncome += transaction.value;
        } else {
          acc.totalExpense += transaction.value;
        }
        const categoryName = transaction.category?.name || "Sem categoria";
        const existing = acc.byCategory.find((item) => item.name === categoryName);
        const amount = transaction.type === "INCOME" ? transaction.value : transaction.value;

        if (existing) {
          existing.amount += amount;
        } else {
          acc.byCategory.push({
            id: transaction.category?.id || transaction.categoryId,
            name: categoryName,
            color: transaction.category?.color || "#6b7280",
            amount,
          });
        }

        return acc;
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        byCategory: [],
      }
    );

    return response.json({
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
      balance: summary.totalIncome - summary.totalExpense,
      byCategory: summary.byCategory,
    });
  } catch (error) {
    return next(error);
  }
}

async function createTransaction(request, response, next) {
  try {
    const { description, value, date, categoryId } = request.body;
    const { type } = request.body;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || (category.userId && category.userId !== request.user.id)) {
      throw new HttpError(404, "Categoria nao encontrada");
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        value,
        date: new Date(date),
        categoryId,
        type,
        userId: request.user.id,
      },
      include: {
        category: true,
      },
    });

    return response.status(201).json({ transaction });
  } catch (error) {
    return next(error);
  }
}

async function updateTransaction(request, response, next) {
  try {
    const { id } = request.params;
    const { description, value, date, categoryId } = request.body;
    const { type } = request.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.userId !== request.user.id) {
      throw new HttpError(404, "Transacao nao encontrada");
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || (category.userId && category.userId !== request.user.id)) {
      throw new HttpError(404, "Categoria nao encontrada");
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        value,
        date: new Date(date),
        categoryId,
        type,
      },
      include: {
        category: true,
      },
    });

    return response.json({ transaction: updatedTransaction });
  } catch (error) {
    return next(error);
  }
}

async function deleteTransaction(request, response, next) {
  try {
    const { id } = request.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.userId !== request.user.id) {
      throw new HttpError(404, "Transacao nao encontrada");
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
