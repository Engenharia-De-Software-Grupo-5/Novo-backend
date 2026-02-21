"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const all_exceptions_filters_1 = require("./common/filters/all-exceptions.filters");
const uppercase_global_pipe_1 = require("./common/pipes/uppercase-global.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new all_exceptions_filters_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }), new uppercase_global_pipe_1.UppercaseGlobalPipe());
    app.enableCors({
        origin: ['http://localhost:4200'],
        methods: 'POST,GET,PATCH,DELETE,PUT',
        allowedHeaders: 'Content-Type, Authorization',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Projeto Novo API')
        .setDescription('API para projeto novo de ES')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }, 'access-token')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map