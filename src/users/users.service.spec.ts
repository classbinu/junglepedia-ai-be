import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  create: jest.fn((dto) => {
    return { id: 1, ...dto };
  }),
};

describe('UsersService', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and return the created data', async () => {
    const createUserDto = {
      email: 'user@example.com',
      password: 'password123',
    };
    const result = await controller.create(createUserDto);

    expect(service.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({ id: 1, ...createUserDto });
  });
});
