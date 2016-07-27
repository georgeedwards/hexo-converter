declare module 'front-matter' {
    function f(arg: string): FrontMatter;
}

interface FrontMatter {
    attributes: FmAttributes;
    body: string;
    frontmatter: string;
}

interface FmAttributes {
    title: string;
    description: string;
}
