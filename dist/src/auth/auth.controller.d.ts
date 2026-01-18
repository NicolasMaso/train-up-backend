import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            phone: string | null;
            avatar: string | null;
        };
        accessToken: string;
    }>;
    getProfile(user: {
        id: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        personalId: string | null;
    }>;
}
