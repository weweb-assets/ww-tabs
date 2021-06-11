const TABS_SETTINGS_OPTIONS = () => {
    return {
        tabFields: {
            path: 'tabFields',
            label: { en: 'Tabs', fr: 'Tabs' },
            type: 'Tabs',
            itemsLabel: 'Tab',
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
            path: 'transition',
        },
        transitionDuration: {
            type: 'Number',
            label: { en: 'Transition duration', fr: 'Durée de la transition' },
            options: {
                min: 0,
                max: 5,
                step: 0.1,
            },
            path: 'transitionDuration',
        },
    };
};

const CUSTOM_POSITION_OPTIONS = () => {
    return {
        leftRightPosition: {
            label: {
                en: 'Left/Right position',
                fr: 'Left/Right position',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: '%', label: '%', min: -100, max: 100 }],
            },
            path: 'leftRightPosition',
        },
        topBottomPosition: {
            label: {
                en: 'Top/Bottom position',
                fr: 'Top/Bottom position',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: '%', label: '%', min: -100, max: 100 }],
            },
            path: 'topBottomPosition',
        },
    };
};

const TABS_STYLE_OPTIONS = content => {
    return {
        position: {
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
            path: 'tabsPosition',
        },
        ...(function () {
            return content.tabsPosition === 'custom' ? CUSTOM_POSITION_OPTIONS() : {};
        })(),
    };
};

export const getSettingsConfigurations = content => {
    return {
        styleOptions: { ...TABS_STYLE_OPTIONS(content) },
        settingsOptions: { ...TABS_SETTINGS_OPTIONS(content) },
    };
};
