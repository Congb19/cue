// import { describe, expect, it, vi } from 'vitest';

import { reactive } from '../src/reactive';

describe('reactivity/reactive', () => {
  it('Object', () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);
    expect(observed).not.toBe(obj);
    expect(observed.foo).toBe(1);
  });
});
