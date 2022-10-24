import { effect } from '../src/effect';
import { reactive } from '../src/reactive';

describe('reactivity/effect', () => {
  // 基本，测试用户传入的函数执行情况
  it('effect1', () => {
    const fn = vi.fn(() => {
      console.log('hello, cue!');
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
  // 嵌套effect测试
  it('effect4', () => {
    let temp1, temp2;
    const obj = reactive({ temp1: true, temp2: true });
    const fn2 = vi.fn(() => {
      console.log('内层fn2执行');
      temp2 = obj.temp2;
    });
    const fn1 = vi.fn(() => {
      console.log('外层fn1执行');
      effect(fn2);
      temp1 = obj.temp1;
    });
    effect(fn1);

    expect(temp1).toBe(true);
    expect(temp2).toBe(true);
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    obj.temp1 = false;
    expect(temp1).toBe(false);
    expect(temp2).toBe(true);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
  });
  // 无限递归循环测试
  it('effect5', () => {
    let obj = reactive({ num: 0 });
    const fn1 = vi.fn(() => {
      // 既读取又写入的effect。
      // 在第一次触发trigger，run的时候，会再次触发读取和写入操作，
      // 就是说第一次还没run完，又进入了下一次的trigger，导致无限递归。
      obj.num++;
      // obj.num = obj.num + 1;
    });
    effect(fn1);
    expect(obj.num).toBe(1);
  });
  // 调度执行 测试
  it('effect6', () => {
    let obj = reactive({ num: 0 });

    const fn1 = vi.fn(() => {
      console.log(obj.num);
    });
    const options = {
      scheduler: vi.fn((fn: Function) => {
        setTimeout(fn);
      }),
    };
    // 对effect新增第二个参数options
    effect(fn1, options);

    expect(fn1).toHaveBeenCalledTimes(1);
    // scheduler在当前宏任务队列里，还没有调用
    expect(options.scheduler).toHaveBeenCalledTimes(0);

    obj.num++;
    // 触发trigger，检测是否正确调用了用户给的scheduler。
    expect(options.scheduler).toHaveBeenCalledTimes(1);

    // TODO: p63，控制执行次数
  });
});
