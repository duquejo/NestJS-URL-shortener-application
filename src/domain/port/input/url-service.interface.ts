export interface IUrlService {
  save(longUrl: string): Promise<string>;
  findById(id: string): Promise<string | null>;
}

export const IUrlService = Symbol('IUrlService');
