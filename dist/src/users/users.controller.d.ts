import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: {
        id: string;
    }): Promise<{
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
    updateMe(user: {
        id: string;
    }, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        avatar: string | null;
    }>;
}
