import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class UppercaseGlobalPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!(value && typeof value === 'object')) return value;

    const prototype = (metadata.metatype || {}).prototype;

    for (const key of Object.keys(value)) {
      const skip = Reflect.getMetadata('skipUppercase', prototype, key);

      if (skip) continue;

      if (isUUID(value[key])) continue;

      const propertyType = Reflect.getMetadata('design:type', prototype, key);

      if (propertyType !== String) continue;

      if (typeof value[key] === 'string') value[key] = value[key].toUpperCase();
    }

    return value;
  }
}
