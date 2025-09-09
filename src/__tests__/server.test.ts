import PlaywrightMCPServer from '../server';

describe('PlaywrightMCPServer', () => {
  let server: PlaywrightMCPServer;

  beforeEach(() => {
    server = new PlaywrightMCPServer();
  });

  afterEach(async () => {
    await server.cleanup();
  });

  test('should create server instance', () => {
    expect(server).toBeInstanceOf(PlaywrightMCPServer);
  });

  test('should cleanup properly', async () => {
    // This should not throw
    await expect(server.cleanup()).resolves.not.toThrow();
  });
});
