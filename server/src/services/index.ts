import { DatabaseService } from "./database";
import { SessionService } from "./session";
import { SpotifyService } from "./spotify";

type ServiceMap = {
  database: DatabaseService;
  spotify: SpotifyService;
  session: SessionService;
};

/**
 * Central place holding all available services.
 * @param override For testing. Replace actual services with fake services during testing.
 * @returns `getService` function for accessing services.
 */
export const ServiceProvider = (override?: Partial<ServiceMap>) => {
  const database = override?.database ?? DatabaseService();
  const spotify = override?.spotify ?? SpotifyService(database);
  const session = override?.session ?? SessionService(database);

  const serviceMap: ServiceMap = {
    database,
    spotify,
    session,
  };

  /**
   * Get service by service name.
   */
  const getService = <TServiceName extends keyof ServiceMap>(
    serviceName: TServiceName
  ) => serviceMap[serviceName];

  return getService;
};

export type ServiceProvider = ReturnType<typeof ServiceProvider>;
