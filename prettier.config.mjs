/** @type {import("prettier").Config}*/
const config = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  bracketSameLine: true,
  singleAttributePerLine: true,
  trailingComma: "es5",
  importOrder: [
    "^.+\\.(css)$",
    "^(react|vite?/?([a-zA-Z/]*))$",
    "<THIRD_PARTY_MODULES>",
    "^@/(?!(components|app))(.*)$",
    "^@/(components|app)/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  tailwindAttributes: ["clsx"],
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
};

export default config;
