export declare function isInlineFrontmatterExpression(value: string): boolean;
export declare function evaluateInlineFrontmatterExpression(frontmatter: unknown, expression: string): any;
export declare function remarkInlineFrontmatter(): (tree: any) => void;
