import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinTable } from 'typeorm/decorator/relations/JoinTable';
import { CafeEntity } from '../cafe/cafe.entity';

@Entity()
export class TiendaEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @Column()
    telefono: string;

    @ManyToMany(() => CafeEntity, cafe => cafe.tiendas)
    @JoinTable()
    cafes: CafeEntity[];

}
