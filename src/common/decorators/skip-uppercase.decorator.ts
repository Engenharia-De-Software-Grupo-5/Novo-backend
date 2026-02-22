import 'reflect-metadata';

export const SkipUppercase = (): PropertyDecorator => {
	return (target: any, propertyKey: string | symbol) => {
		Reflect.defineMetadata('skipUppercase', true, target, propertyKey);
	};
};
