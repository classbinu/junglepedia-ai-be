import { Test, TestingModule } from '@nestjs/testing';

import { UsersMongoRepository } from './users.repository';
import { UsersService } from './users.service';

const mockUsersMongoRepository = {
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

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersMongoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersMongoRepository, useValue: mockUsersMongoRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersMongoRepository>(UsersMongoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      _id: 1,
      email: 'test1@gmail.com',
      password: 'password123',
    };

    const result = await service.create(createUserDto);
    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createUserDto);
  });

  it('should find all users', async () => {
    const usersArray = [
      { _id: 1, email: 'test1@gmail.com', password: 'password123' },
      { _id: 2, email: 'test2@gmail.com', password: 'password456' },
      { _id: 3, email: 'test3@gmail.com', password: 'password789' },
    ];

    const result = await service.findAll();
    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(usersArray);
  });

  it('should return a user by id', async () => {
    const result = await service.findOne('1');
    expect(repository.findOne).toHaveBeenCalledWith('1');
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
    const result = await service.update('1', updateUserDto);
    expect(repository.update).toHaveBeenCalledWith('1', updateUserDto);
    expect(result).toEqual({ _id: '1', ...updateUserDto });
  });

  it('should remove a user by id and return the removed data', async () => {
    const result = await service.remove('1');
    expect(repository.remove).toHaveBeenCalledWith('1');
    expect(result).toEqual({ _id: '1' });
  });
});
