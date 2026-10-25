import { z } from 'zod';

// Converte string numérica do TSE com vírgula para número (ex: "50,46" -> 50.46)
export const tseNumberStringSchema = z.string().transform((val, ctx) => {
  if (!val || val.trim() === '') return 0;
  const normalized = val.replace(/\./g, '').replace(',', '.');
  const num = Number(normalized);
  if (isNaN(num)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Número inválido: ${val}`,
    });
    return z.NEVER;
  }
  return num;
});

export const tseViceCandidateSchema = z.object({
  tp: z.string().optional(),
  sqcand: z.string().optional(),
  nm: z.string().default(''),
  nmu: z.string().default(''),
  sgp: z.string().default(''),
});

export const tseCandidateSchema = z.object({
  n: z.string(), // Número de urna
  sqcand: z.string().optional(),
  nm: z.string(), // Nome completo
  nmu: z.string(), // Nome de urna
  dt: z.string().optional(),
  dvt: z.string().default('Válido'), // Situação da votação
  seq: z.string().optional(),
  e: z.enum(['s', 'n']).default('n'), // Eleito
  st: z.string().default(''),
  vap: tseNumberStringSchema, // Votos apurados
  pvap: tseNumberStringSchema, // Percentual apresentado
  pvapn: tseNumberStringSchema.optional(), // Percentual com mais casas decimais
  vs: z.array(tseViceCandidateSchema).optional().default([]),
});

export const tsePartySchema = z.object({
  n: z.string(),
  sg: z.string(),
  nm: z.string(),
  nfed: z.string().optional().default(''),
  tvtn: tseNumberStringSchema.optional(),
  tvan: tseNumberStringSchema.optional(),
  cand: z.array(tseCandidateSchema).default([]),
});

export const tseCoalitionSchema = z.object({
  n: z.string(),
  nm: z.string().optional().default(''),
  tp: z.string().optional().default(''),
  com: z.string().optional().default(''),
  par: z.array(tsePartySchema).default([]),
});

export const tseFederationSchema = z.object({
  n: z.string(),
  sg: z.string(),
  nm: z.string(),
  com: z.string().optional().default(''),
  npar: z.array(z.string()).optional().default([]),
});

export const tseCargoSchema = z.object({
  cd: z.string(),
  nmn: z.string().optional().default(''),
  nmm: z.string().optional().default(''),
  nmf: z.string().optional().default(''),
  nv: z.string().optional().default('1'),
  fed: z.array(tseFederationSchema).optional().default([]),
  agr: z.array(tseCoalitionSchema).default([]),
});

export const tseSectionsSchema = z.object({
  ts: tseNumberStringSchema, // Total de seções
  st: tseNumberStringSchema, // Seções totalizadas
  pst: tseNumberStringSchema, // % Seções totalizadas
  pstn: tseNumberStringSchema.optional(),
  snt: tseNumberStringSchema.optional(),
  psnt: tseNumberStringSchema.optional(),
  si: tseNumberStringSchema.optional(),
  psi: tseNumberStringSchema.optional(),
  sni: tseNumberStringSchema.optional(),
  psni: tseNumberStringSchema.optional(),
  sa: tseNumberStringSchema.optional(), // Seções apuradas
  psa: tseNumberStringSchema.optional(), // % Seções apuradas
});

export const tseElectorateSchema = z.object({
  te: tseNumberStringSchema, // Total de eleitores
  est: tseNumberStringSchema.optional(),
  pest: tseNumberStringSchema.optional(),
  c: tseNumberStringSchema, // Comparecimento
  pc: tseNumberStringSchema, // % Comparecimento
  a: tseNumberStringSchema, // Abstenção
  pa: tseNumberStringSchema, // % Abstenção
});

export const tseVotesSchema = z.object({
  tv: tseNumberStringSchema, // Total de votos apurados
  vvc: tseNumberStringSchema.optional(),
  vv: tseNumberStringSchema, // Votos válidos
  pvv: tseNumberStringSchema.optional(),
  vb: tseNumberStringSchema, // Votos em branco
  pvb: tseNumberStringSchema, // % Votos em branco
  vn: tseNumberStringSchema, // Votos nulos
  pvn: tseNumberStringSchema, // % Votos nulos
  tvn: tseNumberStringSchema.optional(),
  ptvn: tseNumberStringSchema.optional(),
});

export const tseEA20Schema = z.object({
  ele: z.string(),
  t: z.string(),
  f: z.string().optional(),
  sup: z.string().optional(),
  tpabr: z.string(),
  cdabr: z.string(),
  dg: z.string(), // Data de geração DD/MM/AAAA
  hg: z.string(), // Hora de geração HH:MM:SS
  idg: z.string().optional().default(''),
  dt: z.string(), // Data de totalização
  ht: z.string(), // Hora de totalização
  dv: z.string().optional(),
  tf: z.enum(['s', 'n']).default('n'), // Totalização final
  and: z.enum(['n', 'p', 'f']).default('p'), // Andamento: n=não iniciado, p=parcial, f=final
  md: z.string().optional(),
  carg: z.array(tseCargoSchema),
  s: tseSectionsSchema,
  e: tseElectorateSchema,
  v: tseVotesSchema,
});

export type TseEA20Raw = z.infer<typeof tseEA20Schema>;
