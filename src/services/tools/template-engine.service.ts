import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateEngineService {
    parse(template: string, data: Record<string, any>): string {
        return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
            const value = this.resolvePath(data, key);
            return value !== undefined && value !== null ? String(value) : '';
        });
    }

    private resolvePath(obj: Record<string, any>, path: string): any {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    }
}