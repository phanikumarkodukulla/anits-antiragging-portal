require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');

        // Clear existing admins
        await Admin.deleteMany({});
        console.log('Cleared existing admin accounts');

        // Define 5 default admin accounts
        const defaultAdmins = [
            {
                username: 'admin1',
                password: 'Admin@123',
                fullName: 'Dr. Rajesh Kumar',
                email: 'admin1@college.edu'
            },
            {
                username: 'admin2',
                password: 'Admin@456',
                fullName: 'Prof. Priya Sharma',
                email: 'admin2@college.edu'
            },
            {
                username: 'admin3',
                password: 'Admin@789',
                fullName: 'Dr. Anil Verma',
                email: 'admin3@college.edu'
            },
            {
                username: 'dean',
                password: 'Dean@2024',
                fullName: 'Dean Student Welfare',
                email: 'dean@college.edu'
            },
            {
                username: 'warden',
                password: 'Warden@2024',
                fullName: 'Chief Warden',
                email: 'warden@college.edu'
            }
        ];

        // Hash passwords and create admins
        for (let admin of defaultAdmins) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(admin.password, salt);

            await Admin.create({
                username: admin.username,
                password: hashedPassword,
                fullName: admin.fullName,
                email: admin.email
            });

            console.log(`✓ Created admin: ${admin.username} (${admin.fullName})`);
        }

        console.log('\n✅ Successfully seeded 5 admin accounts!');
        console.log('\n📋 Default Admin Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        defaultAdmins.forEach(admin => {
            console.log(`Username: ${admin.username.padEnd(12)} | Password: ${admin.password.padEnd(12)} | Name: ${admin.fullName}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding admins:', error);
        process.exit(1);
    }
};

seedAdmins();
