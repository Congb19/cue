import { track, trigger } from './effect';

export const ITERATE_KEY = Symbol();

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
      // for-in相关：
      // 判断到底是新增属性还是修改已有属性，修改已有属性的话，不需要触发ITERATE_KEY有关的依赖。
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? 'SET'
        : 'ADD';
      // 效果等同于以前的Object[]。
      // target[key] = value;
      // return true;
      let res = Reflect.set(target, key, value);

      // for-in相关：
      // 把和ITERATE_KEY有关的依赖也再拿出来触发一下。
      trigger(target, key, type);

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
    }
  });
};
