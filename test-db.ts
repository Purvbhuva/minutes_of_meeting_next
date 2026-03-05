import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDb() {
    try {
        console.log('Testing database connection...');
        
        const user = await prisma.mOM_Staff.findUnique({
            where: { EmailAddress: 'admin@demo.com' }
        });
        
        if (user) {
            console.log('✅ User found!');
            console.log('Email:', user.EmailAddress);
            console.log('Name:', user.StaffName);
            console.log('Role:', user.Role);
            console.log('Has Password:', !!user.Password);
        } else {
            console.log('❌ User NOT found!');
        }
        
        const allUsers = await prisma.mOM_Staff.count();
        console.log('Total users in database:', allUsers);
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testDb();
