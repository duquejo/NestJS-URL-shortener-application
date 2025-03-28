import { Repository } from 'typeorm';

type MockedRepositoryMethods<T extends object> = {
  [K in keyof Repository<T>]?: jest.Mock;
};

export type MockRepository<T extends object = any> = Partial<
  MockedRepositoryMethods<T>
>;
