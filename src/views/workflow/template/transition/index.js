import translates from './translates';

export default function Translate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = translates[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}

export const translateModule = {
  translate: ["value", Translate],
};
