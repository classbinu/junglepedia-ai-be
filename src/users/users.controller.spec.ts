import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  create: jest.fn((dto) => {
    return { _id: 1, ...dto };
  }),
  findAll: jest.fn(() => {
    return [
      { _id: 1, email: 'test1@gmail.com', password: 'password123' },
      { _id: 2, email: 'test2@gmail.com', password: 'password456' },
      { _id: 3, email: 'test3@gmail.com', password: 'password789' },
    ];
  }),
  findOne: jest.fn((id: string) => {
    return { _id: id, email: 'test1@gmail.com', password: 'password123' };
  }),
  update: jest.fn((id: string, dto) => {
    return { _id: id, ...dto };
  }),
  remove: jest.fn((id: string) => {
    return { _id: id };
  }),
};

describe('UsersController', () => {
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
    expect(controller).toBeDefined();
  });

  it('should create a user and return the created data', async () => {
    const createUserDto = {
      email: 'user@example.com',
      password: 'password123',
    };
    const result = await controller.create(createUserDto);

    expect(service.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({ _id: 1, ...createUserDto });
  });

  it('should return an array of users', async () => {
    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([
      { _id: 1, email: 'test1@gmail.com', password: 'password123' },
      { _id: 2, email: 'test2@gmail.com', password: 'password456' },
      { _id: 3, email: 'test3@gmail.com', password: 'password789' },
    ]);
  });

  it('should return a user by id', async () => {
    const result = await controller.findOne('1');

    expect(service.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      _id: '1',
      email: 'test1@gmail.com',
      password: 'password123',
    });
  });

  it('should update a user by id and return the updated data', async () => {
    const updateUserDto = {
      email: 'test1@gmail.com',
      password: 'password456',
    };
    const result = await controller.update('1', updateUserDto);
    expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
    expect(result).toEqual({ _id: '1', ...updateUserDto });
  });

  it('should remove a user by id and return the removed data', async () => {
    const result = await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual({ _id: '1' });
  });
});
