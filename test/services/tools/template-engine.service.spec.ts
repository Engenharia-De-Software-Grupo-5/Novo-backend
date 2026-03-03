import { TemplateEngineService } from 'src/services/tools/template-engine.service';

describe('TemplateEngineService', () => {
  let service: TemplateEngineService;

  beforeEach(() => {
    service = new TemplateEngineService();
  });

  it('should replace simple placeholders', () => {
    const res = service.parse('Hello {{name}}!', { name: 'Arthur' });
    expect(res).toBe('Hello Arthur!');
  });

  it('should replace nested placeholders (dot path)', () => {
    const res = service.parse('City: {{user.address.city}}', {
      user: { address: { city: 'Campina Grande' } },
    });
    expect(res).toBe('City: Campina Grande');
  });

  it('should ignore extra spaces inside {{ }}', () => {
    const res = service.parse('Hi {{   name   }}', { name: 'A' });
    expect(res).toBe('Hi A');
  });

  it('should replace missing values with empty string', () => {
    const res = service.parse('X={{missing}} Y={{user.none}}', { user: {} });
    expect(res).toBe('X= Y=');
  });

  it('should stringify non-string values', () => {
    const res = service.parse('N={{n}} B={{b}}', { n: 10, b: true });
    expect(res).toBe('N=10 B=true');
  });

  it('should keep template unchanged when no placeholders', () => {
    const res = service.parse('no vars here', { a: 1 });
    expect(res).toBe('no vars here');
  });
});