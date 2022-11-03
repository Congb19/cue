import { ref } from '../src/ref';
import { effect } from '../src/effect';

describe('reactivity/ref', () => {
  // ref 基础
  it('ref1', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
    a.value = 2;
    expect(a.value).toBe(2);
  });
  // ref在effect中，value变化应该能触发effect函数
  // it('ref2', () => {
  //   const a = ref(1);
  //   let val = 0;
  //   const fn = vi.fn(() => {
  //     val = a.value;
  //   });
  //   effect(fn);

  //   expect(val).toBe(1);
  //   expect(fn).toHaveBeenCalledTimes(1);

  //   // ref 对象是响应式的
  //   a.value = 2;
  //   expect(val).toBe(2);
  //   expect(fn).toHaveBeenCalledTimes(2);

  //   // ref 对象的 value property 的 set 应该具有缓存，不会重复触发依赖
  //   a.value = 2;
  //   expect(val).toBe(2);
  //   expect(fn).toHaveBeenCalledTimes(2);
  // });
});
