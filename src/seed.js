const prisma = require("./lib/prisma");

const defaultCategories = [
  { name: "Alimentacao", color: "#f97316", icon: "🍔" },
  { name: "Transporte", color: "#2563eb", icon: "🚗" },
  { name: "Moradia", color: "#0f766e", icon: "🏠" },
  { name: "Saude", color: "#dc2626", icon: "💊" },
  { name: "Lazer", color: "#8b5cf6", icon: "🎉" },
];

async function main() {
  for (const category of defaultCategories) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: category.name,
        userId: null,
      },
    });

    if (existingCategory) {
      await prisma.category.update({
        where: {
          id: existingCategory.id,
        },
        data: {
          color: category.color,
          icon: category.icon,
          isDefault: true,
        },
      });

      continue;
    }

    await prisma.category.create({
      data: {
        ...category,
        isDefault: true,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
