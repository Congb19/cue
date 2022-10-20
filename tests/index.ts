import { renderer } from './renderer';
import { CNode } from './cnode';

const testnode: CNode = {
  tag: 'div',
  props: {
    onClick: () => console.log('click'),
    testProp: '123asd'
  },
  children: 'testnode'
}
const el = document.getElementById('app');
renderer(testnode, el as HTMLElement);