import { PrismaService } from '../prisma';
import { UpdateUserDto } from './dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
        personalId: string | null;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
    }>;
}
