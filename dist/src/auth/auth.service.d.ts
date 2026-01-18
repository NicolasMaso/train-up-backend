import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    getProfile(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        personalId: string | null;
    }>;
    private generateToken;
}
