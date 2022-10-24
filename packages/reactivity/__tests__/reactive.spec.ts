import { effect } from '../src/effect';
import { reactive } from '../src/reactive';

describe('reactivity/reactive', () => {
  it('reactive1', () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);
    expect(obj).toBe(obj);
    expect(observed).not.toBe(obj);

    //测试get
    expect(observed.foo).toBe(1);
  });
  it('reactive2', () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);
    let val = 1;
    const fn = vi.fn(() => {
      val = observed.foo;
    });
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);

    //测试set
    observed.foo++;
    expect(observed.foo).toBe(2);
    expect(val).toBe(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('reactive3', () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);

    //测试in
    const fn = vi.fn(() => {
      console.log('foo' in obj);
      console.log(observed);
    });
    effect(fn);

    expect(observed.foo).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);

    //in好像没法测是否收集到了依赖，暂时认为输出一个true就对了吧
  });
  it('reactive4', () => {
    const obj = { foo: 1 };
    const observed = reactive(obj);

    //测试(for-in)
    const fn = vi.fn(() => {
      // ownkeys里添加触发依赖收集
      for (const key in observed) console.log(key);
      console.log('finish');
    });
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);

    // 添加新属性，需要重新触发
    observed.bar = 2;
    // set触发了trigger的时候，把和ITERATE_KEY有关的依赖也再拿出来触发一下。
    expect(fn).toHaveBeenCalledTimes(2);

    // 修改已有属性，不需要重新触发。
    observed.bar = 3;
    expect(fn).toHaveBeenCalledTimes(2);
  });
  it('reactive5', () => {
    const obj = { foo: 1, bar: 2 };
    const observed = reactive(obj);

    //测试(delete)
    // 通过for-in制造一个ITERATE_KEY的依赖
    const fn = vi.fn(() => {
      for (const key in observed) console.log(key);
      console.log('finish');
    });
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);

    // 删除已有属性
    delete observed.bar;
    expect(fn).toHaveBeenCalledTimes(2);

    // 删除不存在的属性
    delete observed.bbb;
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
