const COMMON_TABS_OPTIONS = {
    tabs: {
        label: { en: 'Number of tabs', fr: 'Nombre de tabs' },
        type: 'TextSelect',
        options: {
            options: [
                { value: '1', label: { en: '1', fr: '1' } },
                { value: '2', label: { en: '2', fr: '2' } },
                { value: '3', label: { en: '3', fr: '3' } },
                { value: '4', label: { en: '4', fr: '4' } },
                { value: '5', label: { en: '5', fr: '5' } },
                { value: '6', label: { en: '6', fr: '6' } },
                { value: '7', label: { en: '7', fr: '7' } },
                { value: '8', label: { en: '8', fr: '8' } },
                { value: '9', label: { en: '9', fr: '9' } },
                { value: '10', label: { en: '10', fr: '10' } },
            ],
        },
        path: 'numberOfTabs',
    },
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
            ],
        },
        path: 'tabsPosition',
    },
    fixedToTop: {
        label: { en: 'fix and center tabs above', fr: 'fix and center tabs above' },
        type: 'OnOff',
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

const FIXED_TABS_OPTIONS = {
    tabs: {
        label: { en: 'Number of tabs', fr: 'Nombre de tabs' },
        type: 'TextSelect',
        options: {
            options: [
                { value: '1', label: { en: '1', fr: '1' } },
                { value: '2', label: { en: '2', fr: '2' } },
                { value: '3', label: { en: '3', fr: '3' } },
                { value: '4', label: { en: '4', fr: '4' } },
                { value: '5', label: { en: '5', fr: '5' } },
                { value: '6', label: { en: '6', fr: '6' } },
                { value: '7', label: { en: '7', fr: '7' } },
                { value: '8', label: { en: '8', fr: '8' } },
                { value: '9', label: { en: '9', fr: '9' } },
                { value: '10', label: { en: '10', fr: '10' } },
            ],
        },
        path: 'numberOfTabs',
    },
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
    fixedToTop: {
        label: { en: 'Fix tabs above', fr: 'Fix tabs above' },
        type: 'OnOff',
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

export const getSettingsConfigurations = content => {
    const options = [];

    for (let i = 1; i <= content.numberOfTabs; i++) {
        const tabs = i.toString();
        options.push({ value: tabs, label: { en: tabs, fr: tabs } });
    }

    const tabsToEdit = {
        label: { en: 'Tabs to edit', fr: 'Tabs to edit' },
        type: 'TextSelect',
        options: {
            options: options,
        },
        path: 'tabsToEdit',
    };

    return content.fixedToTop
        ? { settingsOptions: { ...FIXED_TABS_OPTIONS, tabsToEdit: tabsToEdit } }
        : { settingsOptions: { ...COMMON_TABS_OPTIONS, tabsToEdit: tabsToEdit } };
};
