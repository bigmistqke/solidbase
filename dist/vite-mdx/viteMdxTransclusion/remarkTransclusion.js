const importRE = /^import ['"](.+)['"]\s*$/;
const mdxRE = /\.mdx?$/;
export function remarkTransclusion({ resolve, readFile, getCompiler, importMap, astCache, }) {
    return () => async (ast, file) => {
        if (!isRootNode(ast))
            return;
        const importer = file.path;
        importMap?.deleteImporter(importer);
        const imports = findMdxImports(ast);
        if (imports.length) {
            const splices = await Promise.all(imports.map(async ({ id, index }) => {
                const importedPath = await resolve(id, importer);
                if (!importedPath) {
                    // Strip unresolved imports.
                    return [index, 1, []];
                }
                importMap?.addImport(importedPath, importer);
                let ast = astCache?.get(importedPath);
                if (!ast) {
                    const importedFile = {
                        path: importedPath,
                        contents: await readFile(importedPath),
                    };
                    const compiler = getCompiler(importedPath);
                    const parsedFile = compiler.parse(importedFile);
                    const compiledFile = await compiler.run(parsedFile, importedFile);
                    ast = compiledFile.children;
                    astCache?.set(importedPath, ast);
                }
                // Inject the AST of the imported markdown.
                return [index, 1, ast];
            }));
            // Apply splices in reverse to ensure preceding indices are stable.
            let { children } = ast;
            for (const [index, deleteCount, inserted] of splices.reverse())
                children = children
                    .slice(0, index)
                    .concat(inserted, children.slice(index + deleteCount));
            ast.children = children;
        }
    };
}
function findMdxImports(ast) {
    const imports = [];
    ast.children.forEach((node, index) => {
        // "import" type is used by @mdx-js/mdx@2.0.0-next.8 and under
        if (node.type === "mdxjsEsm" || node.type === "import") {
            // mdx ast nodes indeed have a value prop:
            // https://github.com/mdx-js/specification#import
            // but @types/unist doesn't declare it
            const id = importRE.exec(node.value)?.[1];
            if (id && mdxRE.test(id)) {
                imports.push({ id, node, index });
            }
        }
    });
    return imports;
}
function isRootNode(node) {
    return node.type === "root";
}
//# sourceMappingURL=remarkTransclusion.js.map