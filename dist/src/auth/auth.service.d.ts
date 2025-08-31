import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface JwtPayload {
    sub: string;
    email: string;
    tenant_id: string;
    role: string;
    iat?: number;
    exp?: number;
}
export interface AuthResult {
    access_token: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        tenant_id: string;
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    };
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    register(registerDto: RegisterDto): Promise<AuthResult>;
    login(loginDto: LoginDto): Promise<AuthResult>;
    logout(userId: string, tenantId: string): Promise<{
        message: string;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    validateJwtPayload(payload: JwtPayload): Promise<any>;
    getProfile(userId: string): Promise<any>;
}
