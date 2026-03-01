const decorator = () => () => undefined;

// evita carregar o AppModule real (e cascata de swagger/controllers)
jest.mock('src/modules/app.module', () => ({
  AppModule: class AppModule {},
}));

jest.mock('@nestjs/core', () => ({
  NestFactory: { create: jest.fn() },
}));

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  })),

  getSchemaPath: jest.fn((cls: any) => `#/components/schemas/${cls?.name ?? 'Object'}`),

  ApiProperty: decorator,
  ApiPropertyOptional: decorator,
  ApiBearerAuth: decorator,
  ApiTags: decorator,
  ApiConsumes: decorator,
  ApiBody: decorator,
  ApiResponse: decorator,
  ApiOperation: decorator,
  ApiParam: decorator,
  ApiQuery: decorator,
  ApiSchema: decorator,
  ApiOkResponse: decorator,
  ApiAcceptedResponse: decorator,
  ApiCreatedResponse: decorator,
  ApiBadRequestResponse: decorator,
  ApiUnauthorizedResponse: decorator,
  ApiNotFoundResponse: decorator,
  ApiForbiddenResponse: decorator,
  ApiInternalServerErrorResponse: decorator,
  ApiExtraModels: decorator,
}));

describe('main bootstrap', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should configure app and listen', async () => {
    await jest.isolateModulesAsync(async () => {
      // importa DEPOIS do reset pra pegar o mock certo
      const { NestFactory } = await import('@nestjs/core');
      const { SwaggerModule } = await import('@nestjs/swagger');

      const useGlobalPipes = jest.fn();
      const useGlobalFilters = jest.fn();
      const useGlobalInterceptors = jest.fn();
      const use = jest.fn();
      const enableCors = jest.fn();
      const setGlobalPrefix = jest.fn();
      const listen = jest.fn().mockResolvedValue(undefined);
      const getHttpAdapter = jest.fn(() => ({ getInstance: jest.fn() }));
      const get = jest.fn();

      // ✅ aqui é o ponto crítico: create TEM que retornar esse objeto
      (NestFactory.create as any).mockResolvedValue({
        useGlobalPipes,
        useGlobalFilters,
        useGlobalInterceptors,
        use,
        enableCors,
        setGlobalPrefix,
        listen,
        getHttpAdapter,
        get,
      });

      (SwaggerModule.createDocument as any).mockReturnValue({});
      (SwaggerModule.setup as any).mockReturnValue(undefined);

      // importa o main só depois do mock configurado
      await import('src/main');

      expect(NestFactory.create).toHaveBeenCalled();
      expect(enableCors).toHaveBeenCalled();
      expect(setGlobalPrefix).toHaveBeenCalledWith('api/v1');
      expect(useGlobalPipes).toHaveBeenCalled();
      expect(useGlobalFilters).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });
  });
});