import { Injectable } from '@nestjs/common';
import { CafeEntity } from './cafe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CafeService {

    constructor(
    @InjectRepository(CafeEntity)
       private readonly cafeRepository: Repository<CafeEntity>
    ){}

    async createCafe(cafe: CafeEntity): Promise<CafeEntity> {
        if(cafe.precio < 0)
        {
            throw new BusinessLogicException("The cafe with the given price is invalid. Negative value received", BusinessError.PRECONDITION_FAILED);
        }

        return await this.cafeRepository.save(cafe);
    }

}
