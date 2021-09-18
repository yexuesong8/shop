import { isFunction, isArray } from "@monkey.do/monkey";
import { getRabbitConsolePrefix } from "@/config";

let id = 0;

class EventBus {
  constructor() {
    this.events = {
    };
  }

  on(event, fn) {
    if (!isFunction(fn)) {
      console.error(`${getRabbitConsolePrefix("utils-EventBus")}请传入正确的回调函数`);
      return;
    }

    id++;

    if (this.events[event]) {
      this.events[event].push({ id, fn });
    } else {
      this.events[event] = [{ id, fn }];
    }
    return id;
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(item => {
        item.fn(...args);
      });
    }
  }

  off(event, ids) {
    if (this.events[event]) {
      if (!ids) {
        this.events[event] = [];
        return;
      }
      if (isArray(ids)) {
        for (let i = 0, len = ids.length; i < len; i++) {
          this._rmEvent(event, ids[i]);
        }
      } else {
        this._rmEvent(event, ids);
      }
    }
  }

  _rmEvent(event, id) {
    const index = this.events[event].findIndex(item => item.id === id);
    if (index !== -1) this.events[event].splice(index, 1);
  }
}

export default new EventBus();
export {
  EventBus,
};
