import inherits from 'inherits';
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isLabel } from "@/views/workflow/template/utils";

inherits(CustomContextPadProvider, ContextPadProvider);

CustomContextPadProvider.$inject = [
  'injector',
  'connect',
  'translate',
  'elementFactory',
];

export default function CustomContextPadProvider(injector, connect, translate) {
  injector.invoke(ContextPadProvider, this);

  // var cached = bind(this.getContextPadEntries, this)
  // var rules = this._rules
  const elementFactory = this._elementFactory;
  const create = this._create;
  const autoPlace = this._autoPlace;
  const modeling = this._modeling;
  // var contextPad = this._contextPadt

  this.getContextPadEntries = function(element) {
    const actions = {};
    const businessObject = element.businessObject;

    function startConnect(event, element, autoActivate) {
      connect.start(event, element, autoActivate);
    }

    function appendAction(type, className, title, options) {
      if (typeof title !== 'string') {
        options = title;
        title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
      }

      function appendStart(event, element) {
        const shape = elementFactory.createShape({ type, ...options });
        create.start(event, shape, {
          source: element,
        });
      }

      const append = autoPlace
        ? function(event, element) {
          const shape = elementFactory.createShape({ type, ...options });
          autoPlace.append(element, shape);
        }
        : appendStart;

      return {
        group: 'model',
        className: className,
        title: title,
        action: {
          dragstart: appendStart,
          click: append,
        },
      };
    }

    function removeElement() {
      modeling.removeElements([element]);
    }
    const type = businessObject.$type;
    // label标签
    if (isLabel(element)) return {};

    switch (type) {
      case "bpmn:StartEvent":
        Object.assign(actions, {
          'append.gateway': appendAction(
            'bpmn:ExclusiveGateway',
            'bpmn-icon-gateway-none',
            translate('Append Gateway'),
          ),
          'append.user-task': appendAction(
            'bpmn:UserTask',
            'bpmn-icon-user-task',
            translate('Append UserTask'),
          ),
        });
        break;
      case "bpmn:ExclusiveGateway":
        Object.assign(actions, {
          'append.user-task': appendAction(
            'bpmn:UserTask',
            'bpmn-icon-user-task',
            translate('Append UserTask'),
          ),
        });
        break;
      case "bpmn:UserTask":
        Object.assign(actions, {
          'append.user-task': appendAction(
            'bpmn:UserTask',
            'bpmn-icon-user-task',
            translate('Append UserTask'),
          ),
          'append.gateway': appendAction(
            'bpmn:ExclusiveGateway',
            'bpmn-icon-gateway-none',
            translate('Append Gateway'),
          ),
        });
        break;
      default:break;
    }

    // 不是开始节点或者结束节点或者连线 添加结束
    if (!is(businessObject, 'bpmn:StartEvent') && !is(businessObject, 'bpmn:EndEvent') && !is(businessObject, 'bpmn:SequenceFlow')) {
      Object.assign(actions, {
        'append.end-event': appendAction(
          'bpmn:EndEvent',
          'bpmn-icon-end-event-none',
          translate('Append EndEvent'),
        ),
      });
    }

    // 不是开始节点或者线条 添加删除
    if (!is(businessObject, 'bpmn:StartEvent')) {
      Object.assign(actions, {
        delete: {
          group: 'edit',
          className: 'bpmn-icon-trash',
          title: translate('Remove'),
          action: {
            click: removeElement,
          },
        },
      });
    }

    // 不是结束节则添加连线
    if (!is(businessObject, 'bpmn:EndEvent') && !is(businessObject, 'bpmn:SequenceFlow')) {
      Object.assign(actions, {
        connect: {
          group: 'connect',
          className: 'bpmn-icon-connection-multi',
          title: translate('Append Sequence'),
          action: {
            click: startConnect,
            dragstart: startConnect,
          },
        },
      });
    }

    return actions;
  };
}
