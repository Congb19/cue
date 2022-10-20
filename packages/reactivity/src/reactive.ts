import { track, trigger } from './effect';

export const reactive = (obj) => {
  return new Proxy(obj, {
    // 代理get和set
    get(target, key, receiver) {
      // 效果等同于以前的Object直接取key。
      // return target[key];
      // 但是Reflect可以接受第三个参数receiver，用来指定本次操作的this指向谁
      // 如果不指定，receiver会指向原始对象，那响应式就会丢失，effect不会运行
      let res = Reflect.get(target, key, receiver);
      
      // 收集deps
      track(target, key);

      return res;
    },
    set(target, key, value) {
      // 效果等同于以前的Object[]。
      // target[key] = value;
      // return true;
      let res = Reflect.set(target, key, value);
      // TODO: 触发依赖
      trigger(target, key);

      return res;
    },
  });
};
