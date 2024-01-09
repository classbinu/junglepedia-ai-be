import { Test, TestingModule } from '@nestjs/testing';

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUsersRepository = {
  create: jest.fn((dto) => {
    return { _id: 1, ...dto };
  }),
  find: jest.fn(() => {
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
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      id: 1,
      email: 'test1@gmail.com',
      password: 'password123',
    };

    const result = await service.create(createUserDto);
    expect(repository.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(createUserDto);
  });

  it('should find all users', async () => {
    const usersArray = [
      { id: 1, email: 'test1@gmail.com', password: 'password123' },
      { id: 2, email: 'test2@gmail.com', password: 'password456' },
      { id: 3, email: 'test3@gmail.com', password: 'password789' },
    ];

    const result = await service.findAll();
    expect(repository.find).toHaveBeenCalled();
    expect(result).toEqual(usersArray);
  });

  it('should return a user by id', async () => {
    const result = await service.findOne('1');
    expect(repository.findOne).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      id: '1',
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
