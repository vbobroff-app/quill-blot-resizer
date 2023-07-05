export function classOf<T> ({constructor}: Object): T {
    return constructor as T;
  }