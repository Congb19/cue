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
  // lazy computed，减少多余的执行次数 
  it('computed2', () => {
    const obj = reactive({ foo: 1, bar: 2 });
    const getter = vi.fn(() => obj.foo + obj.bar);
    const val = computed(getter);

    // TODO
    expect(getter).not.toHaveBeenCalled();
    expect(val.value).toBe(3);
    expect(getter).toHaveBeenCalledTimes(1);

    obj.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    expect(val.value).toBe(4);
    expect(getter).toHaveBeenCalledTimes(2);
  });
  // 在另外一个effect中读取计算属性时，需要正确触发副作用函数。
  it('computed3', () => {
    const obj = reactive({ foo: 1, bar: 2 });
    const getter = vi.fn(() => obj.foo + obj.bar);
    const val = computed(getter);

    let res = 0;

    effect(() => {
      res = val.value;
    });
    expect(res).toBe(3);

    obj.foo++;
    expect(res).toBe(4);
  });
});
