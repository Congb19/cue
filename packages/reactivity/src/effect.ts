//副作用函数，全局
let activeEffect;
//存储副作用函数的桶，全局
const bucket = new WeakMap();

// bucket是一个weakmap，存储的键值对是 target - depsMap
// depsMap是一个map，存储的键值对是 key - deps
// deps是一个set，存储的值是 若干个副作用函数

class ReactiveEffect {
  private fn: any;
  // deps：一个数组，存储所有【包含当前副作用函数的依赖集合】，存的是一堆Set组成的数组。
  // 在track收集时，同时进行deps的收集
  // 这样每个副作用函数的deps里都存好了包含它自身的依赖集合。
  deps: any[];

  constructor(fn) {
    this.fn = fn;
    this.deps = [];
  }

  run() {
    cleanup(this);
    activeEffect = this;
    this.fn();
  }
}
const cleanup = (effect: ReactiveEffect) => {
  for (let i = 0; i < effect.deps.length; i++) {
    const deps = effect.deps[i];
    deps.delete(effect);
  }
  effect.deps.length = 0;
};

export const effect = (fn: Function) => {
  const _effect: ReactiveEffect = new ReactiveEffect(fn);
  _effect.run();
};

// track会在get时触发，用途是收集副作用函数，存入bucket。
export const track = (target, key) => {
  if (!activeEffect) return;

  let depsMap = bucket.get(target);
  if (!depsMap) {
    depsMap = new Map();
    bucket.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  deps.add(activeEffect);
  activeEffect.deps.push(deps);
};

// trigger会在set后触发，用途是取出bucket里存的这些副作用函数，并执行。
export const trigger = (target, key) => {
  const depsMap = bucket.get(target);
  if (!depsMap) return;

  const deps = depsMap.get(key);
  const depsToRun = new Set(deps);
  depsToRun &&
    depsToRun.forEach((dep: any) => {
      dep.run();
    });
};
