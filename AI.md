---
name: ww-tabs
description: The ww-tabs component enables users to switch between content areas through customizable tabs, supporting various positions, alignments, transition effects, and responsive design features.
keywords:
  - tabs component
  - ui element
  - responsive design
  - state management
  - multi-language support
  - transition effects
  - horizontal alignment
  - vertical alignment
  - tab events
  - weweb editor
---

#### ww-tabs

UI element displaying tabs to switch between different content areas. Each tab has a header and content area.

Properties:
- tabsPosition: top | bottom | left | right - Position of tabs relative to content. Default: top
- horizontalAlignment: flex-start | center | flex-end | space-around | space-between - Horizontal alignment when top/bottom. Default: center
- verticalAlignment: start | center | end | flex-start | flex-end | space-around | space-between - Vertical alignment when left/right. Default: center
- transition: none | fade | fadeTopBottom | fadeLeftRight - Transition effect. Default: fade
- transitionDuration: number - Duration in seconds (0-5). Default: 0.4
- value: number - Initially active tab index

Children:
- tabsList: any[][] - Components for tab headers
- tabsContent: any[][] - Components for tab content areas

Example:
{"tag":"ww-tabs","props":{"default":{"transition":"fade","tabsPosition":"top","verticalAlignment":"center","transitionDuration":0.4,"horizontalAlignment":"flex-start"}},"children":{"tabsList":[[{"tag":"ww-div","styles":{"default":{"margin":"0 12px 12px 0","padding":"12px","borderRadius":"8px"}}}]],"tabsContent":[[{"tag":"ww-div","styles":{"default":{"border":"1px solid #E6E6E6","height":"198px","width":"400px"}}}]]}}

Note: Specify width and height for each tabContent or it will feel broken.

Events:
- change: Triggered when active tab changes. Payload: { value: number } - Index of new active tab
- initValueChange: Triggered when initial value changes. Payload: { value: number } - New initial tab index

Variables:
- currentTab: number - Current active tab index, defaults to content.value or 0
