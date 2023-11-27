module.exports = {
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: "all",
  importOrder: [
    "^(^react$|@react|react|^recoil$)",
    "^@mui/(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@/config/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "",
    "^[./]"
  ],
  importOrderGroupNamespaceSpecifiers: true,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["prettier-plugin-tailwindcss"]
}
