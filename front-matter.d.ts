declare module "front-matter" {
    function f(arg: string): frontMatter;
}

interface frontMatter {
    attributes: fmAttributes;
    body: string;
    frontmatter: string;
}

interface fmAttributes {
    title: string;
    description: string;
}