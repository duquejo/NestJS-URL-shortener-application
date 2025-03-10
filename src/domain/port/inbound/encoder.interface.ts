export const IEncoderService = Symbol('IEncoderService');

export interface IEncoderService {
  encode: (id: string) => string;
  decode: (id: string) => string;
}
