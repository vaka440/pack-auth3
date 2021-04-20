import { BadRequestException,  Injectable,  UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../models/refresh-token.model';
import { compare, hash } from 'bcrypt';
import { UserEntity } from '../models/user.model'

@Injectable()
export class RefreshTokensService {

    constructor(
        @InjectRepository(RefreshTokenEntity) private repo: Repository<RefreshTokenEntity>
    ) {}

    public async createRefreshToken (user: UserEntity): Promise<RefreshTokenEntity> {
        const token = new RefreshTokenEntity()
        const ttl = 60 * 60 * 24 * 30;
        
        token.user_id = user.id
        token.is_revoked = false
        
        const expiration = new Date()
        expiration.setTime(expiration.getTime() + ttl)
        
        token.expires = expiration

        return this.repo.save(token)
    }

    public async findTokenById (id: number): Promise<RefreshTokenEntity | null> {
        return this.repo.findOne({
            where: {
                id,
            }
        })
    }    
}
