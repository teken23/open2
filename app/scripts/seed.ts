
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample configs
  const sampleConfig1 = await prisma.config.create({
    data: {
      name: 'Login API Test',
      method: 'POST',
      url: 'https://httpbin.org/post',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Tester/1.0'
      },
      body: '{"username": "{{USERNAME}}", "password": "{{PASSWORD}}"}',
      description: 'Test configuration for login endpoints'
    }
  });

  const sampleConfig2 = await prisma.config.create({
    data: {
      name: 'GET Request Test',
      method: 'GET',
      url: 'https://httpbin.org/get',
      headers: {
        'Authorization': 'Bearer {{TOKEN}}',
        'Accept': 'application/json'
      },
      params: {
        'limit': '10',
        'page': '{{PAGE}}'
      },
      description: 'Test configuration for GET endpoints with parameters'
    }
  });

  // Create sample proxy settings
  const proxyConfig = await prisma.proxySetting.create({
    data: {
      name: 'Local Proxy',
      host: '127.0.0.1',
      port: 8080,
      type: 'HTTP',
      enabled: false
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📋 Created configs: ${sampleConfig1.name}, ${sampleConfig2.name}`);
  console.log(`🔧 Created proxy: ${proxyConfig.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
