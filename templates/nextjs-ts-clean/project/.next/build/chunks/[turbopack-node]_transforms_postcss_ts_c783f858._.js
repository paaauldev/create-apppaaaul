module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/templates/nextjs-ts-clean/project/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/b7e9a__pnpm_0f48fae5._.js",
  "chunks/[root-of-the-server]__c17a219a._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/templates/nextjs-ts-clean/project/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];