export interface IEncoderService {
  encode: (id: string) => string;
  decode: (id: string) => string;
}

export const IEncoderService = Symbol('IEncoderService');
