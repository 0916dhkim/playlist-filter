import { DatabaseService } from ".";

export default function MockDatabaseService(): jest.Mocked<DatabaseService> {
  return {
    getClient: jest.fn(),
    createAuthDoc: jest.fn(),
    getAudioFeaturesCache: jest.fn(),
    getAuthDoc: jest.fn(),
    getProfile: jest.fn(),
    setAudioFeaturesCache: jest.fn(),
    updateAuthDoc: jest.fn(),
  };
}
