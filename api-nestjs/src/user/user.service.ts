import { UserDto, UserLoginDto } from './user.dto';
import { BadRequestException,  Injectable,  UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.model';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private user: Repository<UserEntity>,
  ) {}

  findByID(id: string) {
    return this.user.findOne({ where: { id } });
  }

  findAll() {
    return this.user.find();
  }

  async create({ password, role, email }: UserDto) {
    const isAlreadyInDb = await this.findByEmail(email);

    if (isAlreadyInDb) {
      throw new BadRequestException({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    return this.user.save({
      email,
      role,
      hashedPassword,
    });
  }

  async logUser({ password, email: name }: UserLoginDto) {
    const user = await this.findByEmail(name);

    if (!user) {
      throw new BadRequestException({ message: 'User does not exist' });
    }

    const { hashedPassword, id, role, email } = user;

    const isAuth = await compare(password, hashedPassword);

    if (!isAuth) {
      throw new UnauthorizedException({ message: 'User unauthorized' });
    }

    return { id, role, email };
  }

  getPaginatedUsers(skip: number) {
    return this.user.find({ skip, take: 10 });
  }

  removeUser(id: string) {
    return this.user.delete({ id });
  }

  findByName(username: string) {
    return this.user.findOne({ where: { username } });
  }

  findByEmail(email: string) {
    return this.user.findOne({ where: { email } });
  }

  public async validateCredentials (user: UserLoginDto, password: string): Promise<boolean> {
    return compare(password, user.password)
  }  
}
