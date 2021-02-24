<template>
    <div class="tabs-object" :class="content.tabsPosition" :style="cssVariables">
        <div
            class="tabs-container fixedToTop"
            ref="fixedTabs"
            v-if="content.fixedToTop && this.tabsNumber"
            :class="content.tabsPosition"
            :style="cssTabsFixedPosition"
        >
            <div class="layout-container" v-for="index in this.tabsNumber" :key="index" @click="changeTab(index)">
                <div class="layout-sublayout">
                    <wwLayout
                        class="layout -layout"
                        :class="{ isEditing: isEditing }"
                        :path="`tabsList[${index}]`"
                    ></wwLayout>
                    <transition name="fade" mode="out-in">
                        <wwLayout
                            v-if="currentTabIndex === index || isEditing"
                            class="sublayout -layout"
                            :class="{ isEditing: isEditing }"
                            :path="`subTabLayouts[${currentTabIndex}]`"
                        >
                        </wwLayout>
                        <div v-else :style="{ minHeight: getSublayoutHeight }"></div>
                    </transition>
                </div>
            </div>
        </div>

        <div class="tabs-container" :class="content.tabsPosition" v-if="this.tabsNumber && !content.fixedToTop">
            <div class="layout-container" v-for="index in this.tabsNumber" :key="index" @click="changeTab(index)">
                <div class="layout-sublayout">
                    <wwLayout
                        class="layout -layout"
                        :class="{ isEditing: isEditing }"
                        :path="`tabsList[${index}]`"
                    ></wwLayout>
                    <transition name="fade" mode="out-in">
                        <wwLayout
                            v-if="currentTabIndex === index || isEditing"
                            class="sublayout -layout tabs-sublayout-container"
                            :class="{ isEditing: isEditing }"
                            :path="`subTabLayouts[${index}]`"
                        >
                        </wwLayout>
                        <div v-else :style="{ minHeight: getSublayoutHeight }"></div>
                    </transition>
                </div>
            </div>
        </div>

        <transition :name="activeTransition" mode="out-in">
            <div class="tabs-content" :key="currentTabIndex">
                <wwLayout
                    class="layout -layout"
                    :class="{ isEditing: isEditing }"
                    :path="`tabsContent[${currentTabIndex}]`"
                >
                </wwLayout>
            </div>
        </transition>
    </div>
</template>

<script>
import { getSettingsConfigurations } from './configuration';

export default {
    props: {
        content: Object,
        /* wwEditor:start */
        wwEditorState: Object,
        /* wwEditor:end */
    },
    wwDefaultContent: {
        numberOfTabs: '3',
        tabsPosition: 'top',
        transition: 'fade',
        transitionDuration: 0.5,
        order: null,

        tabsContent: [],
        tabsList: [],
        subTabLayouts: [],
        fixedToTop: false,
        leftRightPosition: '30%',
        topBottomPosition: '-50%',
    },
    /* wwEditor:start */
    wwEditorConfiguration({ content }) {
        return getSettingsConfigurations(content);
    },
    /* wwEditor:end */
    data() {
        return {
            currentTabIndex: 1,
            tabsNumber: 3,
            activeTransition: 'fade',
        };
    },
    watch: {
        'content.numberOfTabs'() {
            this.tabsNumber = parseInt(this.content.numberOfTabs);
        },
    },
    computed: {
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
        cssVariables() {
            return {
                '--tab-transition-duration': this.content.transitionDuration + 's',
            };
        },
        cssTabsFixedPosition() {
            return {
                '--tab-leftRight-position': this.content.leftRightPosition,
                '--tab-topBottom-position': this.content.topBottomPosition,
            };
        },
        getSublayoutHeight() {
            const elHeight = document.querySelectorAll('.tabs-sublayout-container');
            if (elHeight && elHeight.length && elHeight[this.currentTabIndex]) {
                return `${elHeight[this.currentTabIndex].offsetHeight}px`;
            }

            return '24px';
        },
    },
    methods: {
        changeTab(index) {
            this.order = index > this.currentTabIndex ? 'after' : 'before';
            this.handleTransition(this.order);
            this.currentTabIndex = index;
        },
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
    mounted() {
        if (this.content.numberOfTabs) this.tabsNumber = parseInt(this.content.numberOfTabs);
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

    .tabs-content {
        .layout {
            flex-direction: column;
            min-width: 200px;
            &.isEditing {
                border: 1px dashed var(--ww-color-dark-500);
            }
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

                    &.isEditing {
                        border: 1px dashed var(--ww-color-dark-500);
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }

                .sublayout {
                    flex-direction: column;

                    &.isEditing {
                        border: 1px dashed var(--ww-color-dark-500);
                    }
                }
            }
        }

        .tab-dropzone-container {
            width: 100%;
            height: 100%;
            border: 1px solid lightgray;
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
