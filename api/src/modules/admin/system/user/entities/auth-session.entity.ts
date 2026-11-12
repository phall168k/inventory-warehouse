import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({
    schema: 'admin',
    name: 'auth_sessions',
})
export class AuthSessionEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'user_id',
        type: 'uuid',
        nullable: false,
    })
    userId: string;

    @ManyToOne(() => UserEntity, { 
        nullable: false,
        onDelete: 'CASCADE', 
    })
    @JoinColumn({
        name: 'user_id',
    })
    user: UserEntity;

    @Column({
        name: 'refresh_hash',
        type: 'varchar',
        length: '64',
        nullable: false,
    })
    refreshHash: string;

    @Column({
        name: 'expires_at',
        type: 'timestamptz',
        nullable: false,
    })
    expiresAt: Date;

    @Column({
        name: 'revoked_at',
        type: 'timestamptz',
        nullable: true,
    })
    revokedAt: Date;

    @Column({
        name: 'last_used_at',
        type: 'timestamptz',
        nullable: true,
    })
    lastUsedAt: Date;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
    })
    createdAt: Date;
}