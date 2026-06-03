const { z } = require("zod");

const transactionPayloadSchema = z.object({
  description: z.string().min(1, "Descricao obrigatoria"),
  value: z.coerce.number().positive("Valor deve ser maior que zero"),
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Data invalida"),
  categoryId: z.string().min(1, "Categoria obrigatoria"),
  type: z.enum(["INCOME", "EXPENSE"]),
});

module.exports = {
  transactionPayloadSchema,
};
