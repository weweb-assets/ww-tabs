<template>
    <div class="tabs-object" :class="content.tabsPosition" :style="cssVariables">
        <div
            v-if="content.fixedToTop && content.tabFields.items"
            ref="fixedTabs"
            class="tabs-container fixedToTop"
            :class="content.tabsPosition"
            :style="cssTabsFixedPosition"
        >
            <div
                v-for="(field, index) in content.tabFields.items"
                :key="index"
                class="layout-container"
                @click="changeTab(index)"
            >
                <div class="layout-sublayout">
                    <wwLayout class="layout -layout" :path="`tabsList[${index}]`">
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="index === currentTabIndex ? ['active'] : []" />
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </div>
            </div>
        </div>
        <div v-if="content.tabsList && !content.fixedToTop" class="tabs-container" :class="content.tabsPosition">
            <div
                v-for="(field, index) in content.tabFields.items"
                :key="index"
                class="layout-container"
                @click="changeTab(index)"
            >
                <div class="layout-sublayout">
                    <wwLayout class="layout -layout" :path="`tabsList[${index}]`">
                        <template #default="{ item }">
                            <wwLayoutItem>
                                <wwElement v-bind="item" :states="index === currentTabIndex ? ['active'] : []" />
                            </wwLayoutItem>
                        </template>
                    </wwLayout>
                </div>
            </div>
        </div>
        <transition-group :name="activeTransition" mode="out-in">
            <div v-for="(field, index) in content.tabFields.items" :key="index">
                <div v-if="currentTabIndex === index" class="tab-content">
                    <wwLayout
                        class="layout -layout"
                        :class="{ isEditing: isEditing }"
                        :path="`tabsContent[${index}]`"
                    />
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { getSettingsConfigurations } from './configuration';

export default {
    props: {
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
    },
    emits: ['update:content'],
    wwDefaultContent: {
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
        activeTransition: 'fade',
        tabFields: {
            items: [
                {
                    checked: true,
                    index: 0,
                },
                {
                    checked: false,
                    index: 1,
                },
                {
                    checked: false,
                    index: 2,
                },
            ],
            target: null,
            moveHandler: [null, null],
        },
    },
    /* wwEditor:start */
    wwEditorConfiguration({ content }) {
        return getSettingsConfigurations(content);
    },
    /* wwEditor:end */
    data() {
        return {
            currentTabIndex: 0,
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
    watch: {
        'content.tabFields'() {
            if (this.content.tabFields.moveHandler[0] !== null && this.content.tabFields.moveHandler[1] !== null) {
                const tabsList = [...this.content.tabsList] || [];
                const subTabLayouts = [...this.content.subTabLayouts] || [];
                const tabsContent = [...this.content.tabsContent] || [];

                this.moveInArray(
                    tabsList,
                    this.content.tabFields.moveHandler[0],
                    this.content.tabFields.moveHandler[1]
                );
                this.moveInArray(
                    subTabLayouts,
                    this.content.tabFields.moveHandler[0],
                    this.content.tabFields.moveHandler[1]
                );
                this.moveInArray(
                    tabsContent,
                    this.content.tabFields.moveHandler[0],
                    this.content.tabFields.moveHandler[1]
                );
                const tabFields = {
                    items: [...this.content.tabFields.items],
                    target: this.content.tabFields.target,
                    moveHandler: [null, null],
                };

                this.$emit('update:content', {
                    tabFields: tabFields,
                    tabsList: tabsList,
                    subTabLayouts: subTabLayouts,
                    tabsContent: tabsContent,
                });
            }

            if (this.content.tabFields.target) {
                const tabsList = [...this.content.tabsList];
                const subTabLayouts = [...this.content.subTabLayouts];
                const tabsContent = [...this.content.tabsContent];
                tabsList.splice(this.content.tabFields.target, 1);
                subTabLayouts.splice(this.content.tabFields.target, 1);
                tabsContent.splice(this.content.tabFields.target, 1);

                this.$emit('update:content', {
                    tabsList: tabsList,
                    subTabLayouts: subTabLayouts,
                    tabsContent: tabsContent,
                    tabFields: { ...this.content.tabFields, target: null },
                });
            }
            this.currentTabIndex = this.content.tabFields.items.findIndex(item => item.checked);
            this.changeTab(this.currentTabIndex);
        },
    },
    methods: {
        changeTab(index) {
            if (index < 0) return;
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
        moveInArray(arr, old_index, new_index) {
            while (old_index < 0) {
                old_index += arr.length;
            }
            while (new_index < 0) {
                new_index += arr.length;
            }
            if (new_index >= arr.length) {
                let k = new_index - arr.length;
                while (k-- + 1) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
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

            @media only screen and (max-width: 400px) {
                flex-direction: columns;
            }

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
