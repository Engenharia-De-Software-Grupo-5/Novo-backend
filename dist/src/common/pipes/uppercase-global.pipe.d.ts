import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class UppercaseGlobalPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
