import { Test, TestingModule } from '@nestjs/testing';
import { CafeService } from './cafe.service';
import { CafeEntity } from './cafe.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('CafeService', () => {
  let service: CafeService;
  let repository: Repository<CafeEntity>;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CafeService],
    }).compile();
 
    service = module.get<CafeService>(CafeService);
    repository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));
  });
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createCafe should return a new cafe', async () => {
    const cafe: CafeEntity = {
      id: -1,
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      precio: faker.datatype.number({min:1}),
      tiendas: []
    }
 
    const newCafe: CafeEntity = await service.createCafe(cafe);
    expect(newCafe).not.toBeNull();
 
    const storedCafe: CafeEntity = await repository.findOne({where: {id: newCafe.id}})
    expect(storedCafe).not.toBeNull();
    expect(storedCafe.nombre).toEqual(newCafe.nombre)
    expect(storedCafe.precio).toEqual(newCafe.precio)
    expect(storedCafe.descripcion).toEqual(newCafe.descripcion)
  });

  it('createCafe should throw an exception for an invalid cafe', async () => {
    const cafe: CafeEntity = {
      id: -1,
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      precio: -66,
      tiendas: []
    }
    await expect(() => service.createCafe(cafe)).rejects.toHaveProperty("message", "The cafe with the given price is invalid. Negative value received")
  });
 
});