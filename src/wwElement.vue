<template>
    <div class="tabs-object" :class="content.tabsPosition" :style="cssVariables">
        <div
            v-if="fixedToTop && content.tabFields.items"
            ref="fixedTabs"
            class="tabs-container fixedToTop"
            :class="content.tabsPosition"
            :style="cssTabsFixedPosition"
        >
            <div v-for="index in nbOfTabs" :key="index" class="layout-container" @click="currentTabIndex = index - 1">
                <div class="layout-sublayout">
                    <wwLayout class="layout -layout" :path="`tabsList[${index - 1}]`">
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="index - 1 === currentTabIndex ? ['active'] : []" />
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </div>
            </div>
        </div>
        <div v-if="content.tabsList && !fixedToTop" class="tabs-container" :class="content.tabsPosition">
            <div v-for="index in nbOfTabs" :key="index" class="layout-container" @click="currentTabIndex = index - 1">
                <div class="layout-sublayout">
                    <wwLayout class="layout -layout" :path="`tabsList[${index - 1}]`">
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="index - 1 === currentTabIndex ? ['active'] : []" />
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </div>
            </div>
        </div>
        <transition-group :name="activeTransition" mode="out-in">
            <div v-for="index in nbOfTabs" :key="index">
                <div v-if="currentTabIndex === index - 1" class="tab-content">
                    <wwLayout
                        class="layout -layout"
                        :class="{ isEditing: isEditing }"
                        :path="`tabsContent[${index - 1}]`"
                    />
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
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
    setup(props) {
        const initialValue =
            props.content.value === undefined ? 0 : Math.max(0, Math.min(props.content.value, this.nbOfTabs - 1));
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable(
            props.uid,
            'currentTab',
            initialValue
        );

        return { variableValue, setValue };
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
        nbOfTabs() {
            return this.content.tabsList.length;
        },
        cssVariables() {
            return {
                '--tab-transition-duration': this.content.transitionDuration + 's',
            };
        },
        fixedToTop() {
            return this.content.tabsPosition === 'custom';
        },
        cssTabsFixedPosition() {
            return {
                '--tab-leftRight-position': this.content.leftRightPosition,
                '--tab-topBottom-position': this.content.topBottomPosition,
            };
        },
        getSublayoutHeight() {
            const elHeight = wwLib.getFrontDocument().querySelectorAll('.tabs-sublayout-container');
            if (elHeight && elHeight.length && elHeight[this.currentTabIndex]) {
                return `${elHeight[this.currentTabIndex].offsetHeight}px`;
            }
            return '24px';
        },
        currentTabIndex: {
            get() {
                const index = this.variableValue;
                return Math.max(0, Math.min(index, this.nbOfTabs - 1));
            },
            set(index) {
                // Secure index range
                index = Math.max(0, Math.min(index, this.nbOfTabs - 1));
                if (index === this.currentTabIndex) return;

                // Transition
                this.order = index > this.currentTabIndex ? 'after' : 'before';
                this.handleTransition(this.order);

                // Updating
                this.setValue(index);
                this.$emit('trigger-event', { name: 'change', event: { value: index } });
            },
        },
    },
    watch: {
        /* wwEditor:start */
        'wwEditorState.sidepanelContent.tabIndex'(newIndex) {
            this.currentTabIndex = newIndex;
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
            this.setValue(index);
            this.$emit('trigger-event', { name: 'initValueChange', event: { value: index } });
        },
    },
    methods: {
        /* wwEditor:start */
        async addTab() {
            const tabsList = [...this.content.tabsList];
            const tabsContent = [...this.content.tabsContent];

            if (tabsList.length === 0) {
                tabsList.push([]);
                tabsContent.push([]);
            } else {
                if (tabsList && tabsList.length) {
                    const tab = await wwLib.wwObjectHelper.cloneElement(
                        tabsList[tabsList.length - 1].uid,
                        this.wwFrontState.sectionId
                    );
                    tabsList.push(tab);
                }
                if (tabsContent && tabsContent.length) {
                    const content = await wwLib.wwObjectHelper.cloneElement(
                        tabsContent[tabsContent.length - 1].uid,
                        this.wwFrontState.sectionId
                    );
                    tabsContent.push(content);
                }
            }

            this.$emit('update:content', { tabsList, tabsContent });
        },
        removeTab(index) {
            const tabsList = [...this.content.tabsList];
            const tabsContent = [...this.content.tabsContent];
            tabsList.splice(index, 1);
            tabsContent.splice(index, 1);

            this.$emit('update:content', { tabsList, tabsContent });
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
    min-width: 100px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: visible;

    &.top {
        flex-direction: column;
    }
    &.bottom {
        flex-direction: column-reverse;
    }
    &.left {
        flex-direction: row;
    }
    &.right {
        flex-direction: row-reverse;
    }

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

        &.fixedToTop {
            width: 100vw;
            z-index: 9999999;
            position: absolute;
            top: var(--tab-topBottom-position);
            left: var(--tab-leftRight-position);
            transform: translateX(-50%);

            @media only screen and (max-width: 420px) {
                left: calc(var(--tab-leftRight-position) - 11%);
            }
        }

        &.left {
            flex-direction: column;
            align-items: flex-end;
        }

        &.right {
            flex-direction: column;
            align-items: flex-start;
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

// FADE

.fade-enter-active,
.fade-leave-active {
    transition: opacity var(--tab-transition-duration);
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

// FADE TOP

.fadeTop-enter-active,
.fadeTop-leave-active {
    transition: all var(--tab-transition-duration);
}
.fadeTop-enter {
    opacity: 0;
    transform: translateY(8px);
}
.fadeTop-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

// FADE BOTTOM

.fadeBottom-enter-active,
.fadeBottom-leave-active {
    transition: all var(--tab-transition-duration);
}
.fadeBottom-enter {
    opacity: 0;
    transform: translateY(-8px);
}
.fadeBottom-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

// FADE LEFT

.fadeLeft-enter-active,
.fadeLeft-leave-active {
    transition: all var(--tab-transition-duration);
}
.fadeLeft-enter {
    opacity: 0;
    transform: translateX(8px);
}
.fadeLeft-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}

// FADE RIGHT

.fadeRight-enter-active,
.fadeRight-leave-active {
    transition: all var(--tab-transition-duration);
}
.fadeRight-enter {
    opacity: 0;
    transform: translateX(-8px);
}
.fadeRight-leave-to {
    opacity: 0;
    transform: translateX(8px);
}
</style>
