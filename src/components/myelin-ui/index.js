const myelinUI = {
  id: "myelin-ui",
  version: 2,
  dependencies: [
    "@tanstack/react-query-devtools",
    "@tanstack/react-query",
    "framer-motion",
    "myelino@latest",
  ],
  codes: [
    // react-query dependency
    {
      targetDir: "libs/react-query/",
      path: "libs/react-query/react-query-provider.tsx",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/libs/react-query/react-query-provider.tsx`,
    },
    {
      targetDir: "components/myelin/",
      path: "components/myelin/myelin.tsx",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/components/myelin/myelin.tsx`,
    },

    // main component
    {
      targetDir: "components/myelin/",
      path: "components/myelin/myelin.tsx",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/components/myelin/myelin.tsx`,
    },
    {
      targetDir: "components/myelin/components/",
      path: "components/myelin/components/myelin-link.tsx",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/components/myelin/components/myelin-link.tsx`,
    },
    {
      targetDir: "components/myelin/mutations/",
      path: "components/myelin/mutations/use-upsert-custom-translation-mutation.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/components/myelin/mutations/use-upsert-custom-translation-mutation.ts`,
    },
    {
      targetDir: "components/myelin/queries/",
      path: "components/myelin/queries/use-list-custom-translations-query.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/components/myelin/queries/use-list-custom-translations-query.ts`,
    },
    {
      targetDir: "components/myelin/queries/",
      path: "components/myelin/queries/use-list-translations-query.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/components/myelin/queries/use-list-translations-query.ts`,
    },

    // page
    {
      targetDir: "app/(myelin)/",
      path: "app/(myelin)/layout.tsx",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/app/(myelin)/layout.tsx`,
    },
    {
      targetDir: "app/(myelin)/myelin/",
      path: "app/(myelin)/myelin/page.tsx",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/app/(myelin)/myelin/page.tsx`,
    },
    // api routes
    {
      targetDir: "app/api/myelin/list-custom-translations/",
      path: "app/api/myelin/list-custom-translations/route.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/app/api/myelin/list-custom-translations/route.ts`,
    },

    {
      targetDir: "app/api/myelin/list-translations/",
      path: "app/api/myelin/list-translations/route.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/app/api/myelin/list-translations/route.ts`,
    },
    {
      targetDir: "app/api/myelin/upsert-custom-translation/",
      path: "app/api/myelin/upsert-custom-translation/route.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/app/api/myelin/upsert-custom-translation/route.ts`,
    },
    // translations
    {
      targetDir: "locales/en/",
      path: "locales/en/myelin.json",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/locales/en/myelin.json`,
    },
    {
      targetDir: "types/",
      path: "types/myelino.d.ts",
      codeUrl: `https://raw.githubusercontent.com/learnuidev/vishalgautam.io/refs/heads/main/types/myelino.d.ts`,
    },
  ],
};

module.exports = {
  myelinUI,
};
