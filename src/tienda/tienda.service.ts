import { Injectable } from '@nestjs/common';
import { TiendaEntity } from './tienda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
    constructor(
    @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}

    async createTienda(tienda: TiendaEntity): Promise<TiendaEntity> {
        if(tienda.telefono.length != 10)
        {
            throw new BusinessLogicException("The store with the given phone is invalid, it must be 10 characters long", BusinessError.PRECONDITION_FAILED);
        }

        return await this.tiendaRepository.save(tienda);
    }
}
