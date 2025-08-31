import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestWithTenant } from '../common/middleware/tenant.middleware';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./auth.service").AuthResult>;
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthResult>;
    logout(user: any): Promise<{
        message: string;
    }>;
    getProfile(user: any): Promise<any>;
    getMe(req: RequestWithTenant): Promise<{
        user: {
            id: string;
            tenant_id: string;
            email: string;
            role: string;
        };
        tenant: {
            id: string;
            slug: string;
            name: string;
        };
    }>;
}
