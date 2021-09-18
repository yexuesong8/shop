import Vue from 'vue';
import { SvgIcon } from '@monkey.do/monkey'; // svg component

Vue.component('svg-icon', SvgIcon);

const req = require.context('./svg', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

