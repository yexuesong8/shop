import CommandInterceptor from "diagram-js/lib/command/CommandInterceptor";
import { store } from "@/entry/lib";

export default class DefaultElementName extends CommandInterceptor {
  constructor(eventBus, modeling) {
    super(eventBus);

    this.preExecute("shape.create", ({ context }) => {
    });

    this.postExecute("shape.create", ({ context }) => {
      const { shape } = context;
      store.dispatch("workflow/getElementName", shape).then(name => {
        modeling.updateLabel(shape, name);
      });
    });
  }
}

DefaultElementName.$inject = ['eventBus', 'modeling'];
