export function autobind(_, _2, descriptor) {
    const orgMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFunction = orgMethod.bind(this);
            return boundFunction;
        },
    };
    return adjDescriptor;
}
