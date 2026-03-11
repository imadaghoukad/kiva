import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Template from '../models/Template'; // Adjust path depending on execution CWD

dotenv.config({ path: '.env.local' });

// We need an array of templates to seed
const MOCK_TEMPLATES = [
  {
    name: 'Summer Sale Promo',
    category: 'promo',
    canvasSize: { width: 1080, height: 1080 },
    bgImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&q=80',
    textZones: [
      {
        id: uuidv4(),
        text: 'SUMMER SALE',
        x: 100,
        y: 200,
        fontSize: 120,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#ffffff',
        align: 'center',
        letterSpacing: 2,
        lineHeight: 1.1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
      {
        id: uuidv4(),
        text: 'UP TO 50% OFF',
        x: 250,
        y: 350,
        fontSize: 60,
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fill: '#ffe600',
        align: 'center',
        letterSpacing: 0,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
    ],
  },
  {
    name: 'Inspirational Quote',
    category: 'quote',
    canvasSize: { width: 1080, height: 1350 }, // Portrait IG
    bgImageUrl: 'https://images.unsplash.com/photo-15196813937f5-4922097e3ab8?w=1080&q=80',
    textZones: [
      {
        id: uuidv4(),
        text: '"The only way to do great work is to love what you do."',
        x: 100,
        y: 400,
        fontSize: 64,
        fontFamily: 'Georgia, serif',
        fontWeight: 'normal',
        fill: '#ffffff',
        align: 'center',
        letterSpacing: 0,
        lineHeight: 1.4,
        textTransform: 'none',
        rotation: 0,
        visible: true,
        locked: false,
      },
      {
        id: uuidv4(),
        text: '— Steve Jobs',
        x: 100,
        y: 700,
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fill: '#cccccc',
        align: 'center',
        letterSpacing: 1,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
    ],
  },
  {
    name: 'Product Announcement',
    category: 'announcement',
    canvasSize: { width: 1200, height: 630 }, // FB/Twitter shared link
    bgImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    textZones: [
      {
        id: uuidv4(),
        text: 'NEW FEATURE IS LIVE',
        x: 50,
        y: 100,
        fontSize: 80,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fill: '#ffffff',
        align: 'left',
        letterSpacing: -1,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
      {
        id: uuidv4(),
        text: 'Experience the next generation of our product today. Available for all users.',
        x: 50,
        y: 220,
        fontSize: 40,
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fill: '#dddddd',
        align: 'left',
        letterSpacing: 0,
        lineHeight: 1.5,
        textTransform: 'none',
        rotation: 0,
        visible: true,
        locked: false,
      },
    ],
  },
  {
    name: 'Minimal Event Invitation',
    category: 'minimal',
    canvasSize: { width: 1080, height: 1080 },
    bgImageUrl: null,
    textZones: [
      {
        id: uuidv4(),
        text: 'WINE TASTING EVENT',
        x: 200,
        y: 300,
        fontSize: 50,
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'normal',
        fill: '#333333',
        align: 'center',
        letterSpacing: 8,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
      {
        id: uuidv4(),
        text: 'FRIDAY, OCT 24TH | 7:00 PM',
        x: 250,
        y: 400,
        fontSize: 24,
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        fill: '#888888',
        align: 'center',
        letterSpacing: 2,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
      {
        id: uuidv4(),
        text: '123 MAIN ST, SAN FRANCISCO',
        x: 250,
        y: 450,
        fontSize: 24,
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'normal',
        fill: '#888888',
        align: 'center',
        letterSpacing: 2,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
    ],
  },
  {
    name: 'Holiday Greeting',
    category: 'seasonal',
    canvasSize: { width: 1080, height: 1080 },
    bgImageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1080&q=80',
    textZones: [
      {
        id: uuidv4(),
        text: 'Happy Holidays',
        x: 150,
        y: 400,
        fontSize: 100,
        fontFamily: 'Georgia, serif', // Fallback as a classic vibe
        fontWeight: 'bold',
        fill: '#ffffff',
        align: 'center',
        letterSpacing: 0,
        lineHeight: 1.2,
        textTransform: 'none',
        rotation: 0,
        visible: true,
        locked: false,
      },
      {
        id: uuidv4(),
        text: 'WISHING YOU JOY AND HAPPINESS',
        x: 200,
        y: 550,
        fontSize: 30,
        fontFamily: 'Inter',
        fontWeight: 'normal',
        fill: '#e0e0e0',
        align: 'center',
        letterSpacing: 4,
        lineHeight: 1,
        textTransform: 'uppercase',
        rotation: 0,
        visible: true,
        locked: false,
      },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment. Aborting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Clearing existing templates...');
    await Template.deleteMany({});
    
    console.log('Seeding templates...');
    const result = await Template.insertMany(MOCK_TEMPLATES);
    console.log(`Successfully inserted ${result.length} templates.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed templates', error);
    process.exit(1);
  }
}

seed();
