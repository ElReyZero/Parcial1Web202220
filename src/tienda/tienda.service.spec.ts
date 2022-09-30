import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';


describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();
 
    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
  });
   
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('createTienda should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: -1,
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number('##########'),
      cafes: []
    }
 
    const newTienda: TiendaEntity = await service.createTienda(tienda);
    expect(newTienda).not.toBeNull();
 
    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre)
    expect(storedTienda.direccion).toEqual(newTienda.direccion)
    expect(storedTienda.telefono).toEqual(newTienda.telefono)
  });

  it('createTienda should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = {
      id: -1,
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number('########'),
      cafes: []
    }
    await expect(() => service.createTienda(tienda)).rejects.toHaveProperty("message", "The store with the given phone is invalid, it must be 10 characters long")
  });
 
 });
