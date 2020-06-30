import { VsConfig } from '@vertical/types';

export const vsConfig: VsConfig = {
    colorTheme: 'theme-default',
    customScrollbars: false,
    layout: {
        style: 'layout-1',
        width: 'fullwidth',
        alert: {
            customBackgroundColor: true,
            hidden: true,
            position: 'top',
            background: 'root-navy-700',
        },
        header: {
            hidden: false,
            position: 'top',
            primaryBackground: 'root-navy-700',
            secondaryBackground: 'root-navy-900',
            variant: 'header header-6',
        },
        subnav: {
            primaryBackground: 'root-navy-700',
            secondaryBackground: 'root-navy-900',
            folded: false,
            hidden: true,
            position: 'left',
            variant: 'vertical-style-1',
        },
        sidenav: {
            primaryBackground: 'root-navy-700',
            secondaryBackground: 'root-navy-900',
            folded: false,
            hidden: false,
            position: 'left',
            variant: 'vertical-style-1',
        },
        toolbar: {
            customBackgroundColor: true,
            background: 'root-navy-700',
            hidden: false,
            position: 'above',
        },
        footer: {
            customBackgroundColor: true,
            background: 'root-navy-900',
            hidden: true,
            position: 'above-fixed',
        },
        contentBelow: {
            customBackgroundColor: true,
            background: 'root-navy-700',
            hidden: false,
            position: 'below',
        },
        sidepanel: {
            hidden: true,
            position: 'right',
        },
    },
};
