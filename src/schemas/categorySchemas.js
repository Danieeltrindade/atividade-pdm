const { z } = require("zod");

const categoryPayloadSchema = z.object({
  name: z.string().min(1, "Nome obrigatorio"),
  color: z.string().min(1, "Cor obrigatoria"),
  icon: z.string().min(1, "Icone obrigatorio"),
});

module.exports = {
  categoryPayloadSchema,
};
