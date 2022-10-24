import { track, trigger } from './effect';

export const ITERATE_KEY = Symbol();

export const reactiveShallow = (obj) => {
  return createReactive(obj, true);
};
export const reactive = (obj) => {
  return createReactive(obj, false);
};
const createReactive = (obj, isShallow = false) => {
  return new Proxy(obj, {
    // 代理get和set
    get(target, key, receiver) {
      // 新增一个raw，用于访问原始数据target。
      // 用于在set时，判断当前receiver是不是target的代理对象（可能是原型的
      if (key === 'raw') return target;

      // 效果等同于以前的Object直接取key。
      // return target[key];
      // 但是Reflect可以接受第三个参数receiver，用来指定本次操作的this指向谁
      // 如果不指定，receiver会指向原始对象，那响应式就会丢失，effect不会运行
      let res = Reflect.get(target, key, receiver);
      // 收集deps
      track(target, key);

      // 浅响应，第一层直接返回就行
      if (isShallow) return res;

      // 递归，实现深响应
      if (typeof res === 'object' && res !== null) {
        return reactive(res);
      }

      return res;
    },
    set(target, key, value, receiver) {
      // for-in相关：
      // 判断到底是新增属性还是修改已有属性，修改已有属性的话，不需要触发ITERATE_KEY有关的依赖。
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? 'SET'
        : 'ADD';
      // 检查旧值，是否发生了变化。
      let oldVal = target[key];
      // 效果等同于以前的Object[]。
      // target[key] = value;
      // return true;
      let res = Reflect.set(target, key, value, receiver);

      if (
        target === receiver.raw //处理原型链，只有receiver是自己的代理对象时，触发trigger
      ) {
        if (
          oldVal !== value &&
          (oldVal === oldVal || value === value) //处理NaN
        )
          trigger(target, key, type);
      }

      return res;
    },
    has(target, key) {
      let res = Reflect.has(target, key);
      track(target, key);
      return res;
    },
    ownKeys(target) {
      let res = Reflect.ownKeys(target);
      // for-in相关：收集依赖，key使用唯一值ITERATE_KEY。
      track(target, ITERATE_KEY);
      return res;
    },
    deleteProperty(target, key) {
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);
      // 有这个key且删除成功的时候，触发trigger。
      if (hadKey && res) {
        trigger(target, key, 'DELETE');
      }
      return res;
    },
  });
};
