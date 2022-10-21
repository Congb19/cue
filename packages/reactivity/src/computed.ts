import { ReactiveEffect } from './effect';

class ComputedImpl {
  private _effect: ReactiveEffect;
  // dirty：是否不需要重新运行计算
  // 一开始是true，需要运算。运算完置为false。
  // 修改getter里依赖的对象的值时，其实不需要触发运算，因为还没有读取计算结果。
  // 只有在再次读取该计算结果的value时，才会重新触发计算run。
  private dirty: Boolean;
  // val：缓存计算结果。
  private val: any;

  constructor(getter: Function) {
    let _this = this;
    const options = {
      scheduler() {
        _this.dirty = true;
      },
    };
    this._effect = new ReactiveEffect(getter, options);
    this.dirty = true;
  }

  get value() {
    // 把getter作为effect的fn传入，调用它的run就行，返回它的run的结果。
    if (this.dirty) {
      this.val = this._effect.run();
      this.dirty = false;
    }
    return this.val;
  }
}

export const computed = (getter: Function) => {
  return new ComputedImpl(getter);
};
