const { z } = require("zod");

const nameSchema = z
  .string()
  .trim()
  .min(2, "Nome deve ter pelo menos 2 caracteres");

const emailSchema = z
  .string()
  .trim()
  .email("Email invalido")
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(6, "Senha deve ter pelo menos 6 caracteres");

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

module.exports = {
  loginSchema,
  registerSchema,
};
