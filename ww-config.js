export default {
    editor: {
        label: {
            en: 'Tabs',
            fr: 'Onglets',
        },
        icon: 'fontawesome/regular/window-restore',
        menuOptions: {
            quick: {
                label: {
                    en: 'Edit tabs',
                    fr: 'Edit tabs',
                },
                sections: ['tabIndex', 'position'],
            },
        },
        bubble: {
            icon: 'fontawesome/regular/window-restore',
        },
        navigator: {
            groups: ['headers', 'contents'],
        },
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { value: '' } },
        { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    ],
    properties: {
        tabIndex: {
            label: { en: 'Tabs', fr: 'Tabs' },
            type: 'Tabs',
            editorOnly: true,
            options: content => ({
                labels: content.tabsHeader.map((_, index) => ({
                    label: `Tab ${index}`,
                })),
                nbTabs: content.tabsHeader.length,
                add: 'addTab',
                remove: 'removeTab',
            }),
            section: 'settings',
            defaultValue: 0,
        },
        tabsPosition: {
            label: {
                en: 'Tabs position',
                fr: 'Position des tabs',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                ],
            },
            responsive: true,
            defaultValue: 'top',
        },
        tabsContent: {
            hidden: true,
            defaultValue: [{ isWwObject: true, type: 'ww-flexbox' }],
            navigator: {
                group: 'contents',
            },
        },
        tabsHeader: {
            hidden: true,
            defaultValue: [{ isWwObject: true, type: 'ww-flexbox' }],
            navigator: {
                group: 'headers',
            },
        },
        value: {
            label: {
                en: 'Active tab index',
            },
            type: 'Number',
            options: content => ({
                min: 0,
                max: Math.max(0, content.tabsHeader.length - 1),
            }),
            section: 'settings',
            bindable: true,
        },
    },
};
