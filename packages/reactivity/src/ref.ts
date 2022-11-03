import { reactive } from './reactive';

// // ref 对象的接口
// interface Ref {
//   value;
// }

// // Ref 接口的实现类，对操作进行封装
// class RefImpl {
//   private _value;

//   constructor(value) {
//     this._value = value;
//   }

//   get value() {
//     // TODO: 收集依赖

//     return this._value;
//   }

//   set value(newVal) {
//     // TODO: 触发依赖

//     this._value = newVal;
//   }
// }
export const ref = (value) => {
  const wrapper = reactive({ value });
  Object.defineProperty(wrapper, '__c_isRef', {
    value: true,
  });
  return wrapper;
  // return new RefImpl(value);
};

const toRef = (obj, key) => {
  const wrapper = {
    get value() {
      return obj[key];
    },
    set value(val) {
      obj[key] = val;
    },
  };
  Object.defineProperty(wrapper, '__c_isRef', {
    value: true,
  });
  return wrapper;
};
const toRefs = (obj) => {
  const ret = {};
  for (const key in obj) {
    ret[key] = toRef(obj, key);
  }
  return ret;
};
