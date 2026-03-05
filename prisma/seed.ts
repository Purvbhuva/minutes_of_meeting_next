import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')
    
    try {
        // ==================== CLEAR EXISTING DATA ====================
        console.log('🗑️  Clearing existing data...')
        await prisma.mOM_MeetingDocument.deleteMany()
        await prisma.mOM_MeetingMember.deleteMany()
        await prisma.mOM_Meetings.deleteMany()
        await prisma.mOM_MeetingType.deleteMany()
        await prisma.mOM_Staff.deleteMany()
        
        // ==================== CREATE ADMIN USER ====================
        console.log('👤 Creating admin user...')
        const adminPassword = await bcrypt.hash('admin123', 10)
        const admin = await prisma.mOM_Staff.create({
            data: {
                StaffName: 'Admin User',
                EmailAddress: 'admin@demo.com',
                Password: adminPassword,
                MobileNo: '9876543210',
                Role: 'ADMIN',
                Remarks: 'System Administrator with full access',
            },
        })
        console.log(`✅ Created admin user: ${admin.EmailAddress} (Password: admin123)`)

        // ==================== CREATE CONVENER USER ====================
        console.log('👤 Creating convener user...')
        const convenerPassword = await bcrypt.hash('convener123', 10)
        const convener = await prisma.mOM_Staff.create({
            data: {
                StaffName: 'John Convener',
                EmailAddress: 'convener@demo.com',
                Password: convenerPassword,
                MobileNo: '8765432109',
                Role: 'CONVENER',
                Remarks: 'Meeting convenor and organizer',
            },
        })
        console.log(`✅ Created convener user: ${convener.EmailAddress} (Password: convener123)`)

        // ==================== CREATE STAFF USERS ====================
        console.log('👤 Creating staff users...')
        const staffUsers = [
            { name: 'Alice Smith', email: 'alice@demo.com', phone: '7654321098', role: 'STAFF' },
            { name: 'Bob Johnson', email: 'bob@demo.com', phone: '6543210987', role: 'STAFF' },
            { name: 'Carol White', email: 'carol@demo.com', phone: '5432109876', role: 'STAFF' },
            { name: 'David Brown', email: 'david@demo.com', phone: '4321098765', role: 'STAFF' },
            { name: 'Emma Wilson', email: 'emma@demo.com', phone: '3210987654', role: 'STAFF' },
            { name: 'Frank Miller', email: 'frank@demo.com', phone: '2109876543', role: 'STAFF' },
            { name: 'Grace Lee', email: 'grace@demo.com', phone: '1098765432', role: 'STAFF' },
        ]

        const staffMembers = []
        for (const staffData of staffUsers) {
            const hashedPassword = await bcrypt.hash('staff123', 10)
            const staff = await prisma.mOM_Staff.create({
                data: {
                    StaffName: staffData.name,
                    EmailAddress: staffData.email,
                    Password: hashedPassword,
                    MobileNo: staffData.phone,
                    Role: staffData.role,
                    Remarks: `Standard staff member - ${staffData.name}`,
                },
            })
            staffMembers.push(staff)
            console.log(`✅ Created staff user: ${staff.EmailAddress} (Password: staff123)`)
        }

        // ==================== CREATE MEETING TYPES ====================
        console.log('📋 Creating meeting types...')
        const meetingTypes = [
            'Weekly Sync',
            'Project Review',
            'Client Meeting',
            'Board Meeting',
            'Team Standup',
            'Performance Review',
            'Budget Planning'
        ]

        const createdTypes = []
        for (const typeName of meetingTypes) {
            const type = await prisma.mOM_MeetingType.create({
                data: {
                    MeetingTypeName: typeName,
                    Remarks: `Standard ${typeName} meeting`
                }
            })
            createdTypes.push(type)
            console.log(`✅ Created meeting type: ${typeName}`)
        }

        // ==================== CREATE SAMPLE MEETINGS ====================
        console.log('📅 Creating sample meetings...')
        const now = new Date()
        
        // Meeting 1: Upcoming Weekly Sync
        const meeting1Date = new Date(now)
        meeting1Date.setDate(meeting1Date.getDate() + 3)
        
        const meeting1 = await prisma.mOM_Meetings.create({
            data: {
                MeetingTitle: 'Weekly Team Sync Meeting',
                MeetingDescription: 'Regular weekly synchronization meeting for the entire team',
                MeetingDate: meeting1Date,
                MeetingTime: '10:00',
                MeetingTypeID: createdTypes[0].MeetingTypeID,
                Remarks: 'All team members are expected to attend',
                IsCancelled: false,
                MOM_MeetingMember: {
                    create: [
                        { StaffID: admin.StaffID, IsPresent: false },
                        { StaffID: convener.StaffID, IsPresent: false },
                        { StaffID: staffMembers[0].StaffID, IsPresent: false },
                        { StaffID: staffMembers[1].StaffID, IsPresent: false },
                        { StaffID: staffMembers[2].StaffID, IsPresent: false },
                    ]
                }
            }
        })
        console.log(`✅ Created meeting: ${meeting1.MeetingTitle}`)

        // Meeting 2: Project Review (Past)
        const meeting2Date = new Date(now)
        meeting2Date.setDate(meeting2Date.getDate() - 7)
        
        const meeting2 = await prisma.mOM_Meetings.create({
            data: {
                MeetingTitle: 'Project Alpha Review',
                MeetingDescription: 'Quarterly review of Project Alpha progress and milestones',
                MeetingDate: meeting2Date,
                MeetingTime: '14:30',
                MeetingTypeID: createdTypes[1].MeetingTypeID,
                Remarks: 'Completed - All objectives met',
                IsCancelled: false,
                MOM_MeetingMember: {
                    create: [
                        { StaffID: convener.StaffID, IsPresent: true },
                        { StaffID: staffMembers[0].StaffID, IsPresent: true },
                        { StaffID: staffMembers[3].StaffID, IsPresent: true },
                    ]
                },
                MOM_MeetingDocument: {
                    create: [
                        { 
                            DocumentName: 'Project_Alpha_Presentation.pdf',
                            DocumentPath: '/uploads/meetings/project_alpha_review.pdf',
                            Sequence: 1,
                            Remarks: 'Main presentation slides'
                        },
                        { 
                            DocumentName: 'Meeting_Minutes.docx',
                            DocumentPath: '/uploads/meetings/project_alpha_minutes.docx',
                            Sequence: 2,
                            Remarks: 'Detailed meeting minutes and action items'
                        }
                    ]
                }
            }
        })
        console.log(`✅ Created meeting: ${meeting2.MeetingTitle}`)

        // Meeting 3: Client Meeting (Upcoming)
        const meeting3Date = new Date(now)
        meeting3Date.setDate(meeting3Date.getDate() + 10)
        
        const meeting3 = await prisma.mOM_Meetings.create({
            data: {
                MeetingTitle: 'Client XYZ Requirement Gathering',
                MeetingDescription: 'Meeting with Client XYZ to gather detailed requirements for new module',
                MeetingDate: meeting3Date,
                MeetingTime: '15:00',
                MeetingTypeID: createdTypes[2].MeetingTypeID,
                Remarks: 'Important client meeting - CEO participation required',
                IsCancelled: false,
                MOM_MeetingMember: {
                    create: [
                        { StaffID: admin.StaffID, IsPresent: false },
                        { StaffID: convener.StaffID, IsPresent: false },
                        { StaffID: staffMembers[4].StaffID, IsPresent: false },
                        { StaffID: staffMembers[5].StaffID, IsPresent: false },
                    ]
                }
            }
        })
        console.log(`✅ Created meeting: ${meeting3.MeetingTitle}`)

        // Meeting 4: Board Meeting
        const meeting4Date = new Date(now)
        meeting4Date.setDate(meeting4Date.getDate() + 20)
        
        const meeting4 = await prisma.mOM_Meetings.create({
            data: {
                MeetingTitle: 'Board of Directors Meeting Q1 2026',
                MeetingDescription: 'Quarterly board meeting to discuss organizational strategy and performance',
                MeetingDate: meeting4Date,
                MeetingTime: '09:00',
                MeetingTypeID: createdTypes[3].MeetingTypeID,
                Remarks: 'Confidential - Board members only',
                IsCancelled: false,
                MOM_MeetingMember: {
                    create: [
                        { StaffID: admin.StaffID, IsPresent: false },
                        { StaffID: convener.StaffID, IsPresent: false },
                    ]
                }
            }
        })
        console.log(`✅ Created meeting: ${meeting4.MeetingTitle}`)

        // Meeting 5: Cancelled Meeting
        const meeting5Date = new Date(now)
        meeting5Date.setDate(meeting5Date.getDate() + 5)
        
        const meeting5 = await prisma.mOM_Meetings.create({
            data: {
                MeetingTitle: 'Team Building Activity - CANCELLED',
                MeetingDescription: 'Outdoor team building event',
                MeetingDate: meeting5Date,
                MeetingTime: '11:00',
                MeetingTypeID: createdTypes[4].MeetingTypeID,
                Remarks: 'Original meeting - cancelled due to weather',
                IsCancelled: true,
                CancellationDateTime: new Date(),
                CancellationReason: 'Unfavourable weather conditions',
                MOM_MeetingMember: {
                    create: staffMembers.slice(0, 4).map(staff => ({
                        StaffID: staff.StaffID,
                        IsPresent: false,
                    }))
                }
            }
        })
        console.log(`✅ Created cancelled meeting: ${meeting5.MeetingTitle}`)

        // ==================== SUMMARY ====================
        console.log('\\n' + '='.repeat(60))
        console.log('✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!\\n')
        console.log('📋 TEST CREDENTIALS:')
        console.log('━'.repeat(60))
        console.log('Admin User:')
        console.log('  📧 Email: admin@demo.com')
        console.log('  🔑 Password: admin123\\n')
        console.log('Convener User:')
        console.log('  📧 Email: convener@demo.com')
        console.log('  🔑 Password: convener123\\n')
        console.log('Staff Users (All same password):')
        staffUsers.forEach((user, index) => {
            console.log(`  ${index + 1}. 📧 ${user.email} | 🔑 staff123`)
        })
        console.log('━'.repeat(60))
        console.log(`\\n📊 Data Summary:`)
        console.log(`  ✅ ${1 + 1 + staffUsers.length} Staff members created`)
        console.log(`  ✅ ${createdTypes.length} Meeting types created`)
        console.log(`  ✅ 5 Sample meetings created`)
        console.log(`  ✅ Database is ready for testing!\\n`)
        console.log('🚀 Start the application with: npm run dev')
        console.log('🌐 Visit: http://localhost:3000')
        console.log('='.repeat(60))

    } catch (error) {
        console.error('❌ Error during seeding:', error)
        process.exit(1)
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
