export interface VNode {
    type: string;
    props: Record<string, any>;
    children: VNode[];
    [key: string]: any;
}