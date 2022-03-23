<template>
    <div class="ww-tabs" :class="[content.tabsPosition, { editing: isEditing }]" :style="cssVariables">
        <wwLayout
            :path="`tabsHeader`"
            disable-drag-drop
            class="tabs-list"
            :class="content.tabsPosition"
            @update:list="onTabsHeaderUpdate"
        >
            <template #default="{ item, index }">
                <wwLayoutItem>
                    <wwElement
                        v-bind="item"
                        :states="index === currentTabIndex ? ['active'] : []"
                        @click="currentTabIndex = index"
                    />
                </wwLayoutItem>
            </template>
        </wwLayout>
        <wwLayout
            :path="`tabsContent`"
            class="tabs-content"
            disable-drag-drop
            :transition="{ name: activeTransition, mode: 'out-in' }"
            @update:list="onTabsContentUpdate"
        >
            <template #default="{ item, index }">
                <wwLayoutItem>
                    <wwElement v-if="currentTabIndex === index" :key="index" v-bind="item" />
                </wwLayoutItem>
            </template>
        </wwLayout>
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
    setup(props) {
        const nbOfTabs = computed(() => props.content.tabsHeader.length);
        const initialValue =
            props.content.value === undefined ? 0 : Math.max(0, Math.min(props.content.value, nbOfTabs.value - 1));
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable(
            props.uid,
            'currentTab',
            initialValue
        );

        return { variableValue, setValue, nbOfTabs };
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
        cssVariables() {
            return {
                '--tab-transition-duration': `${this.content.transitionDuration}s`,
            };
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
            const tabsHeader = [...this.content.tabsHeader];
            const tabsContent = [...this.content.tabsContent];

            if (tabsHeader.length === 0) {
                tabsHeader.push(
                    await wwLib.createElement('ww-flexbox', {}, { name: 'New tab' }, this.wwFrontState.sectionId)
                );
                tabsContent.push(
                    await wwLib.createElement(
                        'ww-flexbox',
                        {},
                        { name: 'New tab content' },
                        this.wwFrontState.sectionId
                    )
                );
            } else {
                if (tabsHeader && tabsHeader.length) {
                    tabsHeader.push(
                        await wwLib.wwObjectHelper.cloneElement(
                            tabsHeader[tabsHeader.length - 1].uid,
                            this.wwFrontState.sectionId,
                            'New tab header'
                        )
                    );
                }
                if (tabsContent && tabsContent.length) {
                    tabsContent.push(
                        await wwLib.wwObjectHelper.cloneElement(
                            tabsContent[tabsContent.length - 1].uid,
                            this.wwFrontState.sectionId,
                            'New tab content'
                        )
                    );
                }
            }

            this.$emit('update:content', { tabsHeader, tabsContent });
        },
        removeTab(index) {
            const tabsHeader = [...this.content.tabsHeader];
            const tabsContent = [...this.content.tabsContent];
            tabsHeader.splice(index, 1);
            tabsContent.splice(index, 1);

            this.$emit('update:content', { tabsHeader, tabsContent });
        },
        onTabSelected(uid, index) {
            this.currentTabIndex = index;
        },
        /* wwEditor:end */
        async onTabsHeaderUpdate({ type, index }) {
            /* wwEditor:start */
            switch (type) {
                case 'add': {
                    const tabsContent = [...this.content.tabsContent];
                    let newElement;
                    if (tabsContent[index - 1]) {
                        newElement = await wwLib.wwObjectHelper.cloneElement(
                            tabsContent[index - 1].uid,
                            this.wwFrontState.sectionId,
                            'New tab content'
                        );
                    } else {
                        newElement = await wwLib.createElement(
                            'ww-flexbox',
                            {},
                            { name: 'New tab content' },
                            this.wwFrontState.sectionId
                        );
                    }
                    tabsContent.splice(index, 0, newElement);
                    this.$emit('update:content', { tabsContent });
                    break;
                }
                case 'remove': {
                    const tabsContent = [...this.content.tabsContent];
                    tabsContent.splice(index, 1);
                    this.$emit('update:content', { tabsContent });
                    break;
                }
                case 'move': {
                    break;
                }
            }
            /* wwEditor:end */
        },
        async onTabsContentUpdate({ type, index }) {
            /* wwEditor:start */
            switch (type) {
                case 'add': {
                    const tabsHeader = [...this.content.tabsHeader];
                    let newElement;
                    if (tabsHeader[index - 1]) {
                        newElement = await wwLib.wwObjectHelper.cloneElement(
                            tabsHeader[index - 1].uid,
                            this.wwFrontState.sectionId,
                            'New tab header'
                        );
                    } else {
                        newElement = await wwLib.createElement(
                            'ww-flexbox',
                            {},
                            { name: 'New tab content' },
                            this.wwFrontState.sectionId
                        );
                    }
                    tabsHeader.splice(index, 0, newElement);
                    this.$emit('update:content', { tabsHeader });
                    break;
                }
                case 'remove': {
                    const tabsHeader = [...this.content.tabsHeader];
                    tabsHeader.splice(index, 1);
                    this.$emit('update:content', { tabsHeader });
                    break;
                }
                case 'move': {
                    break;
                }
            }
            /* wwEditor:end */
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
};
</script>

<style lang="scss" scoped>
.ww-tabs {
    --tab-transition-duration: 0.5s;
    display: flex;
    flex-direction: column;
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
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .tabs-list {
        display: flex;
        &.top,
        &.bottom {
            justify-content: center;
        }
        &.left,
        &.right {
            flex-direction: column;
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
