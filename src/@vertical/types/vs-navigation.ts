export interface VsNavigationItem {
    id: string;
    title: string;
    type: 'item' | 'group' | 'collapsable';
    translate?: string;
    icon?: string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    function?: any;
    level?: number;
    open?: boolean;
    selected?: boolean;

    badge?: {
        title?: string;
        translate?: string;
        bg?: string;
        fg?: string;
    };
    children?: VsNavigationItem[];
}

export interface VsNavigation extends VsNavigationItem {
    children?: VsNavigationItem[];
}
