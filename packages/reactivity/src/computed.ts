import { ReactiveEffect } from './effect';

class ComputedImpl {
  private _effect: ReactiveEffect;

  constructor(getter) {
    this._effect = new ReactiveEffect(getter);
  }

  get value() {
    // 把getter作为effect的fn传入，调用它的run就行，返回它的run的结果。
    return this._effect.run();
  }
}

export const computed = (getter) => {
  return new ComputedImpl(getter);
};
