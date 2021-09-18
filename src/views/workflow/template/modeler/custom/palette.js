// import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */

export default class PaletteProvider {
  constructor(palette, create, elementFactory, globalConnect, bpmnFactory) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.palette = palette;

    palette.registerProvider(this);
  }

  // getPaletteEntries(element) {
  getPaletteEntries() {
    // const { create, elementFactory, bpmnFactory } = this;
    const { create, elementFactory } = this;

    // function createTask() {
    //   return function(event) {
    //     const businessObject = bpmnFactory.create('bpmn:Task', { custom: 2 });
    //     // businessObject['custom'] = 1 // 这样不行
    //     const shape = elementFactory.createShape({
    //       type: 'bpmn:Task',
    //       customId: 1,
    //       businessObject,
    //     });
    //     const label = elementFactory.createLabel();
    //     create.start(event, shape);
    //     // create.start(event, label);
    //   };
    // }

    function createAction({ type, group, className, title, options, action }) {
      function createListener(event) {
        const shape = elementFactory.createShape({ type, ...options });
        if (options) shape.businessObject.di.isExpanded = options.isExpanded;
        create.start(event, shape);
      }

      return {
        group,
        className,
        title,
        action: action || {
          dragstart: createListener,
          click: createListener,
        },
      };
    }

    return {
      // "create.start-event": createAction({
      //   type: "bpmn:StartEvent",
      //   group: 'event',
      //   // class: 'bpmn-icon-start-event-none',
      //   className: 'icon-custom start',
      //   title: '开始',
      // }),
      // 'create.task': createAction({
      //   type: "bpmn:Task",
      //   group: "task",
      //   title: '任务',
      //   className: "bpmn-icon-task",
      //   action: {
      //     dragstart: createTask(),
      //     click: createTask(),
      //   },
      // }),
      'create.user-task': createAction({
        type: "bpmn:UserTask",
        group: "task",
        title: '人工节点',
        className: "bpmn-icon-user-task",
      }),
      'create.exclusive-gateway': createAction({
        type: "bpmn:ExclusiveGateway",
        group: 'gateway',
        // className: 'bpmn-icon-gateway-none',
        className: 'icon-custom auto',
        title: '自动节点',
      }),
      'create.end-event': createAction({
        type: 'bpmn:EndEvent',
        group: "event",
        // className: "bpmn-icon-end-event-none",
        className: "icon-custom end",
        title: "结束",
      }),
    };
  }
}

// 注入到paletteProvider的参数
// palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate
// bpmn-js/lib/features/palette/PaletteProvider
PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'globalConnect',
  'bpmnFactory',
];
