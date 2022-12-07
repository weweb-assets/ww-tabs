export default {
    editor: {
        label: {
            en: 'Tabs (legacy)',
            fr: 'Onglets (legacy)',
        },
        menuOptions: {
            quick: {
                label: {
                    en: 'Edit tabs',
                    fr: 'Edit tabs',
                },
                sections: ['tabIndex', 'position'],
            },
        },
        deprecated: 'Use tabs from the Elements panel instead of this one.',
    },
    properties: {
        tabIndex: {
            label: { en: 'Tabs', fr: 'Tabs' },
            type: 'Tabs',
            editorOnly: true,
            options: content => ({
                labels: content.tabsList.map(({ item }, index) => ({
                    label: 'Tab ' + (index + 1),
                })),
                prefixLabel: 'Tab',
                nbTabs: content.tabsList.length,
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
                    { value: 'custom', label: 'Custom' },
                ],
            },
            responsive: true,
            defaultValue: 'top',
        },
        leftRightPosition: {
            hidden: content => content.tabsPosition === 'custom',
            label: {
                en: 'Left/Right position',
                fr: 'Left/Right position',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: '%', label: '%', min: -100, max: 100 }],
            },
            defaultValue: '30%',
        },
        topBottomPosition: {
            hidden: content => content.tabsPosition === 'custom',
            label: {
                en: 'Top/Bottom position',
                fr: 'Top/Bottom position',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: '%', label: '%', min: -100, max: 100 }],
            },
            defaultValue: '-50%',
        },
        transition: {
            label: { en: 'Transition', fr: 'Transition' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'none', label: { en: 'None', fr: 'Aucune' } },
                    { value: 'fade', label: { en: 'Fade', fr: 'Fade' } },
                    { value: 'fadeTopBottom', label: { en: 'Fade top / bottom', fr: 'Fade top / bottom' } },
                    { value: 'fadeLeftRight', label: { en: 'Fade right / left', fr: 'Fade right / left' } },
                ],
            },
            defaultValue: 'fade',
        },
        transitionDuration: {
            type: 'Number',
            label: { en: 'Transition duration', fr: 'Durée de la transition' },
            options: {
                min: 0,
                max: 5,
                step: 0.1,
            },
            defaultValue: 0.4,
        },
        tabsContent: {
            hidden: true,
            defaultValue: [],
        },
        tabsList: {
            hidden: true,
            defaultValue: [[], [], []],
        },
        subTabLayouts: {
            hidden: true,
            defaultValue: [[], [], []],
        },
    },
};
