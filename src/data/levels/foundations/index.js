import bridge from './07-bridge';
import columns from './02-columns';
import crag from './05-crag';
import crossroads from './01-crossroads';
import doubleNotch from './04-double-notch';
import stairStep from './03-stair-step';
import swoop from './06-swoop';
import switchback from './08-switchback';

const foundationsLevels = [
  crossroads,
  columns,
  stairStep,
  doubleNotch,
  crag,
  swoop,
  bridge,
  switchback,
];

export const FOUNDATIONS_SET = {
  id: 'foundations',
  name: 'Foundations',
  levels: foundationsLevels,
};

export default FOUNDATIONS_SET;
