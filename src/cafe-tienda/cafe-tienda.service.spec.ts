import { Test, TestingModule } from '@nestjs/testing';
import { CafeTiendaService } from './cafe-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { CafeEntity } from '../cafe/cafe.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CafeTiendaService', () => {
  let service: CafeTiendaService;
  let tiendaRepository: Repository<TiendaEntity>;
  let cafeRepository: Repository<CafeEntity>;
  let tienda: TiendaEntity;
  let cafesList : CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CafeTiendaService],
    }).compile();

    service = module.get<CafeTiendaService>(CafeTiendaService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    cafeRepository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    cafeRepository.clear();
    tiendaRepository.clear();

    cafesList = [];
    for(let i = 0; i < 5; i++){
        const cafe: CafeEntity = await cafeRepository.save({
          nombre: faker.name.firstName(),
          descripcion: faker.lorem.sentence(),
          precio: faker.datatype.number({min:1}),
        })
        cafesList.push(cafe);
    }

    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number('##########'),
      cafes: cafesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCafeTienda should add an cafe to a tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      precio: faker.datatype.number({min:1}),
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number('##########'),
    })

    const result: TiendaEntity = await service.addCafeToTienda(newTienda.id, newCafe.id);
    
    expect(result.cafes.length).toBe(1);
    expect(result.cafes[0]).not.toBeNull();
    expect(result.cafes[0].nombre).toBe(newCafe.nombre)
    expect(result.cafes[0].descripcion).toBe(newCafe.descripcion)
    expect(result.cafes[0].precio).toBe(newCafe.precio)
  });

  it('addCafeTienda should thrown exception for an invalid cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      direccion: faker.address.streetAddress(),
      telefono: faker.phone.number('##########'),
    })

    await expect(() => service.addCafeToTienda(newTienda.id, 0)).rejects.toHaveProperty("message", "The cafe with the given id was not found");
  });

  it('addCafeTienda should throw an exception for an invalid tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.sentence(),
      precio: faker.datatype.number({min:1}),
    });

    await expect(() => service.addCafeToTienda(0, newCafe.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });
});
