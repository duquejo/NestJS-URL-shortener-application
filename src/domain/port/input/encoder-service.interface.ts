export interface IEncoderService {
  encode: (id: string) => string | null;
  decode: (id: string) => string | null;
}

export const IEncoderService = Symbol('IEncoderService');
