const i18next = {
  i18next: {
    id: "i18next",
    version: 2,

    variants: {
      nextjs: {
        dependencies: [
          "i18next",
          "i18next-browser-languagedetector",
          "i18next-chained-backend",
          "i18next-resources-to-backend",
          "react-i18next",
        ],

        codes: [
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/cookie-utils.ts",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/cookie-utils.ts`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/i18n-config.ts",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/i18n-config.ts`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/i18n-next-provider.tsx",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/i18n-next-provider.tsx`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/init.ts",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/init.ts`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/language-switcher.tsx",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/language-switcher.tsx`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/use-translation.tsx",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/use-translation.tsx`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/get-lang-and-direction.ts",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/get-lang-and-direction.ts`,
          },
          {
            targetDir: "libs/i18n-next/",
            path: "libs/i18n-next/i18n-next-html-provider.tsx",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/libs/i18n-next/i18n-next-html-provider.tsx`,
          },
          {
            targetDir: ".",
            path: "middleware.ts",
            codeUrl: `https://raw.githubusercontent.com/learnuidev/myelin.dev/refs/heads/main/middleware.ts`,
          },
        ],
      },
      tanstack: {
        dependencies: [
          "i18next",
          "i18next-browser-languagedetector",
          "i18next-chained-backend",
          "i18next-resources-to-backend",
          "react-i18next",
          "@tanstack/start",
        ],
        codes: [
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/cookie-utils.ts",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/cookie-utils.ts",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/cookies.ts",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/cookies.ts",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/get-lang-and-direction.ts",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/get-lang-and-direction.ts",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/i18n-config.ts",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/i18n-config.ts",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/i18n-next-html-provider.tsx",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/i18n-next-html-provider.tsx",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/i18n-next-provider.tsx",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/i18n-next-provider.tsx",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/init.ts",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/init.ts",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/language-switcher.tsx",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/language-switcher.tsx",
          },
          {
            targetDir: "src/libs/i18n-next/",
            path: "src/libs/i18n-next/use-translation.tsx",
            codeUrl:
              "https://raw.githubusercontent.com/learnuidev/mamachef/refs/heads/main/src/libs/i18n-next/use-translation.tsx",
          },
        ],
      },
    },
  },
};

module.exports = {
  i18next,
};
