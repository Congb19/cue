// import { describe, expect, it, vi } from 'vitest';

import { effect } from '../src/effect';
import { reactive } from '../src/reactive';

describe('reactivity/effect', () => {
  // 基本，测试用户传入的函数执行情况
  it('effect1', () => {
    const fn = vi.fn(() => {
      console.log('test effect 1');
    });
    // fn传入时，会执行一次。
    effect(fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });
  // 响应，测试响应式对象是否正常触发track和trigger，响应式对象的值是否正常改变。
  it('effect2', () => {
    let num;
    const counter = reactive({ num: 0 });
    const fn = vi.fn(() => {
      num = counter.num;
    });
    // 第一轮开始。run的时候触发num属性的依赖收集
    effect(fn);
    // 第一轮依赖收集结束，num上绑了fn。
    expect(num).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);

    // 第二轮开始
    counter.num++;
    // 触发num的trigger，运行一次fn。
    expect(num).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  // 分支切换测试
  it('effect3', () => {
    let text;
    const obj = reactive({ ok: true, text: 'hello' });
    const fn = vi.fn(() => {
      text = obj.ok ? obj.text : 'not';
    });
    // 第一轮开始。run的时候触发两个属性的依赖收集
    effect(fn);
    // 第一轮依赖收集结束，ok和text上都绑了fn。
    expect(fn).toHaveBeenCalledTimes(1);
    expect(text).toBe('hello');

    // 第二轮开始
    obj.ok = false;
    // 触发ok的trigger，对fn进行了cleanup。此时ok和text上绑的fn都没了。
    // 随后运行一次fn。run的时候触发了ok的依赖收集
    // 第二轮依赖收集结束，只有ok上绑了fn。
    expect(fn).toHaveBeenCalledTimes(2);
    expect(text).toBe('not');

    // 因为obj.ok此时是false，fn和obj.text已经没有了关系，text永远都是not。
    // 所以此时fn不需要再执行一次。如果fn写的很复杂，再执行一次的话会无故消耗性能。

    // 第三轮开始
    obj.text = 'hello 1';
    // 并不会触发text的trigger，因为text上这时没有绑fn。
    // 所以这时fn不会再执行一次了。
    expect(fn).toHaveBeenCalledTimes(2);
    expect(text).toBe('not');
  });
});
