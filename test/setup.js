process.env.NODE_ENV = 'test'; // Add this line at the top

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});