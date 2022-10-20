// import { describe, expect, it, vi } from 'vitest';

import { effect } from '../src/effect';
import { reactive } from '../src/reactive';

describe('reactivity/effect', () => {
  // 基本，测试用户传入的函数执行情况
  it('effect1', () => {
    const fn = vi.fn(() => {
      console.log('test effect 1');
    });
    effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });
  // 响应，测试响应式对象是否正常触发track和trigger，响应式对象的值是否正常改变。
  it('effect2', () => {
    let num;
    const counter = reactive({ num: 0 });
    effect(() => (num = counter.num));

    expect(num).toBe(0);
    counter.num++;
    expect(num).toBe(1);
  });
  // 分支切换测试
  it('effect3', () => {
    let text;
    const obj = reactive({ ok: true, text: 'hello' });
    const fn = vi.fn(() => {
      text = obj.ok ? obj.text : 'not';
    });
    effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(text).toBe('hello');
    obj.ok = false;
    expect(fn).toHaveBeenCalledTimes(2);
    expect(text).toBe('not');
    obj.text = 'hello 1';
    // 此时fn不需要再执行一次，因为obj.ok是false，fn和obj.text已经没有了关系，text永远都是not。
    expect(fn).toHaveBeenCalledTimes(2);
    expect(text).toBe('not');
  });
});
