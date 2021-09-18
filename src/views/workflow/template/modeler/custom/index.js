import PaletteProvider from './palette';
import ContextPadProvider from './contextPad';
import CustomRenderer from "./render";
import DefaultElementName from "./defaultElementName";

export default {
  __init__: ['paletteProvider', 'customRenderer', 'contextPadProvider', 'defaultElementName'],
  paletteProvider: ['type', PaletteProvider],
  customRenderer: ['type', CustomRenderer],
  contextPadProvider: ['type', ContextPadProvider],
  defaultElementName: ['type', DefaultElementName],
};
