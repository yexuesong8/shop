const req = require.context('../../assets/rabbit/icons/svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys();
const re = /\.\/(.*)\.svg/;

const iconNames = requireAll(req).map(i => {
  return i.match(re)[1];
});

export default iconNames;
