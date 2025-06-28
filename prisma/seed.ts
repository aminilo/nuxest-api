import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const properties = [
  {
    title: 'Luxury House - 01',
    slug: 'luxury-house-01',
    address: 'Rasht, Iran',
    price: 550000,
    image: '/uploads/property-images/luxury-house-01.jpg',
    beds: 3,
    baths: 2,
    sqft: 2600,
    description: 'An elegant villa with a beautiful garden, located in the green city of Rasht.',
    phone: '+98 911 000 0001',
    lat: 37.2808,
    lng: 49.5832
  },
  {
    title: 'Luxury House - 02',
    slug: 'luxury-house-02',
    address: 'Tehran, Iran',
    price: 620000,
    image: '/uploads/property-images/luxury-house-02.jpg',
    beds: 4,
    baths: 2,
    sqft: 2900,
    description: 'Modern architecture and spacious interiors with premium features in central Tehran.',
    phone: '+98 912 000 0002',
    lat: 35.6892,
    lng: 51.3890
  },
  {
    title: 'Luxury House - 03',
    slug: 'luxury-house-03',
    address: 'Isfahan, Iran',
    price: 990000,
    image: '/uploads/property-images/luxury-house-03.jpg',
    beds: 5,
    baths: 3,
    sqft: 3600,
    description: 'Historic luxury mansion featuring traditional Persian architecture near Naghsh-e Jahan Square.',
    phone: '+98 913 000 0007',
    lat: 32.6539,
    lng: 51.6660
  },
  {
    title: 'Family House - 01',
    slug: 'family-house-01',
    address: 'Shiraz, Iran',
    price: 980000,
    image: '/uploads/property-images/family-house-01.jpg',
    beds: 5,
    baths: 3,
    sqft: 3400,
    description: 'Spacious family home with large rooms and close to schools in beautiful Shiraz.',
    phone: '+98 917 000 0003',
    lat: 29.5918,
    lng: 52.5836
  },
  {
    title: 'Family House - 02',
    slug: 'family-house-02',
    address: 'Tehran, Iran',
    price: 1250000,
    image: '/uploads/property-images/family-house-02.jpg',
    beds: 5,
    baths: 3,
    sqft: 3800,
    description: 'Elegant family estate with a private yard and high-end finishes in northern Tehran.',
    phone: '+98 912 000 0004',
    lat: 35.7670,
    lng: 51.4300
  },
  {
    title: 'Family House - 03',
    slug: 'family-house-03',
    address: 'Shiraz, Iran',
    price: 680000,
    image: '/uploads/property-images/family-house-03.jpg',
    beds: 3,
    baths: 2,
    sqft: 2200,
    description: 'Affordable family house with cozy interior and access to public parks.',
    phone: '+98 917 000 0005',
    lat: 29.6163,
    lng: 52.5319
  },
  {
    title: 'Family House - 04',
    slug: 'family-house-04',
    address: 'Mashhad, Iran',
    price: 850000,
    image: '/uploads/property-images/family-house-04.jpg',
    beds: 4,
    baths: 2,
    sqft: 2700,
    description: 'Comfortable family home near religious sites with modern amenities in Mashhad.',
    phone: '+98 915 000 0006',
    lat: 36.2605,
    lng: 59.6168
  },
  {
    title: 'Studio Flat - 01',
    slug: 'studio-flat-01',
    address: 'Yazd, Iran',
    price: 185000,
    image: '/uploads/property-images/studio-flat-01.jpg',
    beds: 1,
    baths: 1,
    sqft: 600,
    description: 'Compact studio in historic city center with authentic wind tower cooling system.',
    phone: '+98 935 000 0008',
    lat: 31.8974,
    lng: 54.3569
  },
  {
    title: 'Modern Apartment - 01',
    slug: 'modern-apartment-01',
    address: 'Tabriz, Iran',
    price: 380000,
    image: '/uploads/property-images/modern-apartment-01.jpg',
    beds: 2,
    baths: 1,
    sqft: 1250,
    description: 'Contemporary apartment with smart home features near El Goli Park.',
    phone: '+98 914 000 0009',
    lat: 38.0962,
    lng: 46.2736
  },
  {
    title: 'Desert Villa - 01',
    slug: 'desert-villa-01',
    address: 'Kerman, Iran',
    price: 480000,
    image: '/uploads/property-images/desert-villa-01.jpg',
    beds: 3,
    baths: 3,
    sqft: 2700,
    description: 'Eco-friendly villa with panoramic desert views and private oasis garden.',
    phone: '+98 934 000 0010',
    lat: 30.2839,
    lng: 57.0834
  }
];

const members = [
  {
    name: 'Amir',
    role: 'Full-stack developer',
    imageUrl: 'https://randomuser.me/api/portraits/men/17.jpg',
    bio: 'Focuses on building smooth & interactive UIs & APIs & CLIs.'
  },
  {
    name: 'Joey',
    role: 'Product Designer',
    imageUrl: 'https://randomuser.me/api/portraits/men/37.jpg',
    bio: 'Crafts user experiences with a sharp eye for detail & accessibility.'
  },
  {
    name: 'Dibzi',
    role: 'Frontend Developer',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Focuses on building smooth & interactive user interfaces using Vue & Nuxt.'
  },
  {
    name: 'Ross',
    role: 'Backend Developer',
    imageUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Designs secure & scalable APIs using NestJS & SQL.'
  },
  {
    name: 'Hanieh',
    role: 'Project Manager',
    imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'Keeps the team aligned & delivers features on time with agile practices.'
  }
];

async function main() {
  try {
    await prisma.property.deleteMany();
  } catch (err) { console.warn('Property table may not exist yet, skipping deleteMany'); }

  try {
    await prisma.user.deleteMany();
  } catch (err) { console.warn('User table may not exist yet, skipping deleteMany'); }

  try {
    await prisma.member.deleteMany();
  } catch (err) { console.warn('Member table may not exist yet, skipping deleteMany'); }

  // Now safely seed
  const user = await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      password: await bcrypt.hash('Test1234', 11),
    },
  });

  for (const property of properties) {
    await prisma.property.create({
      data: {
        ...property,
        price: property.price.toString(),
        ownerId: user.id,
      },
    });
  }

  for (const member of members) {
    await prisma.member.create({ data: member });
  }
}

main().then(()=> {
    console.log('🌱 Seed complete');
    return prisma.$disconnect();
  }).catch((err)=> {
    console.error(err);
    return prisma.$disconnect();
  });
