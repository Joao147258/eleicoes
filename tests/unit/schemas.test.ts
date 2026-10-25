import { describe, it, expect } from 'vitest';
import { tseNumberStringSchema, tseEA20Schema } from '@/modules/elections/infrastructure/tse/schemas';

describe('TSE Schemas Zod', () => {
  it('deve converter strings com vírgula e pontos de milhar para números float', () => {
    expect(tseNumberStringSchema.parse('50,46')).toBe(50.46);
    expect(tseNumberStringSchema.parse('16.385.358')).toBe(16385358);
    expect(tseNumberStringSchema.parse('0,00')).toBe(0);
    expect(tseNumberStringSchema.parse('')).toBe(0);
  });

  it('deve falhar se a string não for conversível para número válido', () => {
    expect(() => tseNumberStringSchema.parse('invalido-abc')).toThrow();
  });

  it('deve rejeitar payload vazio ou ausente de campos obrigatórios', () => {
    expect(() => tseEA20Schema.parse({})).toThrow();
  });
});
