// import { describe, expect, it, vi } from 'vitest';

import { reactive } from '../src/reactive';
import { effect } from '../src/effect';
import { computed } from '../src/computed';

describe('reactivity/computed', () => {
  // 基础的computed。
  it('computed1', () => {
    const obj = reactive({ foo: 1, bar: 2 });
    const val = computed(() => obj.foo + obj.bar);
    expect(val.value).toBe(3);
    obj.foo = 2;
    expect(val.value).toBe(4);
  });
});
