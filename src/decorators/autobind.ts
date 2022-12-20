//autobind decorator
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const orgMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunction = orgMethod.bind(this);
      return boundFunction;
    },
  };
  return adjDescriptor;
}
