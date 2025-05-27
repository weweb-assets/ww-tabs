<template>
    <div class="tabs-object" :class="{ editing: isEditing }" :style="tabsObjectStyle" ww-responsive="tabs-object">
        <wwLocalContext localKey="tab" :data="globalTabData" :methods="globalTabMethods">
            <div v-if="content.tabsList" class="tabs-container" :style="tabsContainerStyle" ww-responsive="tabs-container">
                <div v-for="index in nbOfTabs" :key="index" class="layout-container" @click="switchToTab(index - 1)">
                    <wwLocalContext 
                        localKey="tabItem" 
                        :data="{
                            tabIndex: index - 1,
                            tabLabel: content.tabLabels?.[index - 1] || `Tab ${index}`,
                            isActive: index - 1 === currentTabIndex
                        }"
                    >
                        <div class="layout-sublayout">
                            <wwLayout class="layout -layout" :path="`tabsList[${index - 1}]`">
                                <template #default="{ item }">
                                    <wwLayoutItem>
                                        <wwElement v-bind="item" :states="index - 1 === currentTabIndex ? ['active'] : []" />
                                    </wwLayoutItem>
                                </template>
                            </wwLayout>
                        </div>
                    </wwLocalContext>
                </div>
            </div>
            <div class="tab-contents">
                <transition-group :name="activeTransition" mode="out-in" tag="div">
                    <template v-for="index in nbOfTabs">
                        <div v-if="currentTabIndex === index - 1" :key="index" class="tab-content">
                            <wwLocalContext 
                                localKey="tabItem" 
                                :data="{
                                    tabIndex: index - 1,
                                    tabLabel: content.tabLabels?.[index - 1] || `Tab ${index}`,
                                    isActive: true
                                }"
                            >
                                <wwLayout
                                    class="layout -layout"
                                    :class="{ isEditing: isEditing }"
                                    :path="`tabsContent[${index - 1}]`"
                                />
                            </wwLocalContext>
                        </div>
                    </template>
                </transition-group>
            </div>
        </wwLocalContext>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        wwFrontState: { type: Object, required: true },
        uid: { type: String, required: true },
    },
    emits: ['update:content', 'trigger-event', 'update:sidepanel-content'],
    setup(props, { emit }) {
        const nbOfTabs = computed(() => props.content.tabsList.length);
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'currentTab',
            type: 'number',
            defaultValue: computed(() =>
                props.content.value === undefined ? 0 : Math.max(0, Math.min(props.content.value, nbOfTabs.value - 1))
            ),
        });

        const currentTabIndex = computed({
            get() {
                const index = variableValue.value;
                return Math.max(0, Math.min(index, nbOfTabs.value - 1));
            },
            set(index) {
                // Secure index range
                index = Math.max(0, Math.min(index, nbOfTabs.value - 1));
                if (index === currentTabIndex.value) return;
                setValue(index);
                emit('trigger-event', { name: 'change', event: { value: index } });
            }
        });

        // Global tab context data (shared across all tabs)
        const globalTabData = computed(() => ({
            currentTabIndex: currentTabIndex.value,
            totalTabs: nbOfTabs.value,
            tabPosition: props.content.tabsPosition,
            tabLabels: props.content.tabLabels || [],
        }));

        // Global tab methods
        const globalTabMethods = {
            goToTab: (index) => {
                setCurrentTabIndex(index);
            },
            goToNextTab: () => {
                const nextIndex = currentTabIndex.value + 1;
                if (nextIndex < nbOfTabs.value) {
                    setCurrentTabIndex(nextIndex);
                }
            },
            goToPreviousTab: () => {
                const prevIndex = currentTabIndex.value - 1;
                if (prevIndex >= 0) {
                    setCurrentTabIndex(prevIndex);
                }
            }
        };

        /* wwEditor:start */
        const { cloneElement } = wwLib.useCreateElement();
        /* wwEditor:end */

        const setCurrentTabIndex = (index) => {
            // Secure index range
            index = Math.max(0, Math.min(index, nbOfTabs.value - 1));
            if (index === currentTabIndex.value) return;
            
            setValue(index);
        };

        return {
            variableValue,
            setValue,
            nbOfTabs,
            currentTabIndex,
            setCurrentTabIndex,
            globalTabData,
            globalTabMethods,
            /* wwEditor:start */
            cloneElement,
            /* wwEditor:end */
        };
    },
    data() {
        return {
            order: null,
            activeTransition: 'fade',
        };
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        tabsObjectStyle() {
            const style = { '--tab-transition-duration': this.content.transitionDuration + 's' };

            switch (this.content.tabsPosition) {
                case 'top':
                    style['flex-direction'] = 'column';
                    break;
                case 'bottom':
                    style['flex-direction'] = 'column-reverse';
                    break;
                case 'left':
                    style['flex-direction'] = 'row';
                    break;
                case 'right':
                    style['flex-direction'] = 'row-reverse';
                    break;
            }
            return style;
        },
        getSublayoutHeight() {
            const elHeight = wwLib.getFrontDocument().querySelectorAll('.tabs-sublayout-container');
            if (elHeight && elHeight.length && elHeight[this.currentTabIndex]) {
                return `${elHeight[this.currentTabIndex].offsetHeight}px`;
            }
            return '24px';
        },
        tabsContainerStyle() {
            const isHorizontal = this.content.tabsPosition === 'top' || this.content.tabsPosition === 'bottom';

            const style = {
                justifyContent: isHorizontal ? this.content.horizontalAlignment : this.content.verticalAlignment,
                alignItems: !isHorizontal ? this.content.horizontalAlignment : this.content.verticalAlignment,
            };

            if (this.content.tabsPosition === 'left' || this.content.tabsPosition === 'right') {
                style['flex-direction'] = 'column';
                style['width'] = 'auto';
                style['min-width'] = '10px';
            }

            return style;
        },
    },
    watch: {
        /* wwEditor:start */
        'wwEditorState.sidepanelContent.tabIndex'(newIndex) {
            this.switchToTab(newIndex);
        },
        currentTabIndex(value) {
            if (this.wwEditorState.sidepanelContent.tabIndex !== value) {
                this.$emit('update:sidepanel-content', { value, path: 'tabIndex' });
            }
        },
        /* wwEditor:end */
        'content.value'(value) {
            // Secure index range
            const index = Math.max(0, Math.min(value, this.nbOfTabs - 1));
            if (index === this.currentTabIndex) return;
            this.currentTabIndex = index;
            this.$emit('trigger-event', { name: 'initValueChange', event: { value: index } });
        },
    },
    methods: {
        switchToTab(index) {
            // Secure index range
            index = Math.max(0, Math.min(index, this.nbOfTabs - 1));
            if (index === this.currentTabIndex) return;

            // Transition
            this.order = index > this.currentTabIndex ? 'after' : 'before';
            this.handleTransition(this.order);

            // Updating (event will be emitted by the setter)
            this.currentTabIndex = index;
        },
        /* wwEditor:start */
        async addTab() {
            const tabsList = [...this.content.tabsList];
            const tabsContent = [...this.content.tabsContent];

            if (tabsList.length === 0) {
                tabsList.push([]);
                tabsContent.push([]);
            } else {
                if (tabsList && tabsList.length) {
                    const tab = [];
                    tabsList[tabsList.length - 1].forEach(async el => {
                        const { uid } = await this.cloneElement(el.uid, { name: `Header ${tabsList.length + 1}` });
                        tab.push(uid);
                    });
                    tabsList.push(tab);
                }
                if (tabsContent && tabsContent.length) {
                    const content = [];
                    tabsContent[tabsContent.length - 1].forEach(async el => {
                        const { uid } = await this.cloneElement(el.uid, { name: `Content ${tabsContent.length + 1}` });
                        content.push(uid);
                    });
                    tabsContent.push(content);
                }
            }

            this.$emit('update:content', { tabsList, tabsContent });
        },
        removeTab(index) {
            const tabsList = [...this.content.tabsList];
            const tabsContent = [...this.content.tabsContent];
            const tabLabels = [...(this.content.tabLabels || [])];
            
            tabsList.splice(index, 1);
            tabsContent.splice(index, 1);
            if (tabLabels.length > index) {
                tabLabels.splice(index, 1);
            }

            this.$emit('update:content', { tabsList, tabsContent, tabLabels });
        },
        moveTabUp(index) {
            if (index <= 0) return;
            
            const tabsList = [...this.content.tabsList];
            const tabsContent = [...this.content.tabsContent];
            const tabLabels = [...(this.content.tabLabels || [])];
            
            [tabsList[index], tabsList[index - 1]] = [tabsList[index - 1], tabsList[index]];
            [tabsContent[index], tabsContent[index - 1]] = [tabsContent[index - 1], tabsContent[index]];
            if (tabLabels.length > index) {
                [tabLabels[index], tabLabels[index - 1]] = [tabLabels[index - 1], tabLabels[index]];
            }
            
            this.$emit('update:content', { tabsList, tabsContent, tabLabels });
        },
        moveTabDown(index) {
            if (index >= this.content.tabsList.length - 1) return;
            
            const tabsList = [...this.content.tabsList];
            const tabsContent = [...this.content.tabsContent];
            const tabLabels = [...(this.content.tabLabels || [])];
            
            [tabsList[index], tabsList[index + 1]] = [tabsList[index + 1], tabsList[index]];
            [tabsContent[index], tabsContent[index + 1]] = [tabsContent[index + 1], tabsContent[index]];
            if (tabLabels.length > index + 1) {
                [tabLabels[index], tabLabels[index + 1]] = [tabLabels[index + 1], tabLabels[index]];
            }
            
            this.$emit('update:content', { tabsList, tabsContent, tabLabels });
        },
        updateTabLabel({ index, label }) {
            const tabLabels = [...(this.content.tabLabels || [])];
            
            // Ensure the array is long enough
            while (tabLabels.length <= index) {
                tabLabels.push(null);
            }
            
            tabLabels[index] = label;
            
            this.$emit('update:content', { tabLabels });
        },
        /* wwEditor:end */
        handleTransition(order) {
            switch (this.content.transition) {
                case 'fade':
                    this.activeTransition = 'fade';
                    break;
                case 'none':
                    this.activeTransition = '';
                    break;
                case 'fadeTopBottom':
                    this.activeTransition = order === 'after' ? 'fadeTop' : 'fadeBottom';
                    break;
                case 'fadeLeftRight':
                    this.activeTransition = order === 'after' ? 'fadeLeft' : 'fadeRight';
                    break;
                default:
                    this.activeTransition = 'fade';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.tabs-object {
    --tab-transition-duration: 0.5s;
    --tab-leftRight-position: 30%;
    --tab-topBottom-position: -50%;

    position: relative;
    flex-direction: column;
    justify-content: center;

    .tab-content {
        .layout {
            flex-direction: column;
            min-width: 200px;
        }
    }

    .tabs-container {
        z-index: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        position: relative;
        width: 100%;
        min-width: 390px;

        @media only screen and (max-width: 400px) {
            min-width: auto;
        }

        .layout-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .layout-sublayout {
                flex-direction: row;
                justify-content: center;
                align-items: center;

                .layout {
                    flex-direction: column;
                    width: fit-content;
                    height: fit-content;
                    min-width: 80px;

                    &:hover {
                        cursor: pointer;
                    }
                }

                .sublayout {
                    flex-direction: column;
                }
            }
        }

        .tab-dropzone-container {
            width: 100%;
            height: 100%;
            padding: 10px 10px;

            .tab_dropzone {
                width: 100px;
                height: 100px;
            }
        }
    }
}

.tab-contents {
    position: relative;
    flex: 1;
}

// FADE

.fade-enter-active,
.fade-leave-active {
    transition: opacity var(--tab-transition-duration);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

// FADE TOP

.fadeTop-enter-active,
.fadeTop-leave-active {
    transition: all var(--tab-transition-duration);
}

.fadeTop-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.fadeTop-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

.fadeTop-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

// FADE BOTTOM

.fadeBottom-enter-active,
.fadeBottom-leave-active {
    transition: all var(--tab-transition-duration);
}

.fadeBottom-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.fadeBottom-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

.fadeBottom-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

// FADE LEFT

.fadeLeft-enter-active,
.fadeLeft-leave-active {
    transition: all var(--tab-transition-duration);
}

.fadeLeft-enter-from {
    opacity: 0;
    transform: translateX(8px);
}

.fadeLeft-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

.fadeLeft-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

// FADE RIGHT

.fadeRight-enter-active,
.fadeRight-leave-active {
    transition: all var(--tab-transition-duration);
}

.fadeRight-enter-from {
    opacity: 0;
    transform: translateX(-8px);
}

.fadeRight-leave-to {
    opacity: 0;
    transform: translateX(8px);
}

.fadeRight-leave-active {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
</style>
