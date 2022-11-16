import { DatabaseService } from "./database";
import { EnvService } from "./env";
import { SessionService } from "./session";
import { SpotifyService } from "./spotify";

type ServiceMap = {
  database: DatabaseService;
  env: EnvService;
  spotify: SpotifyService;
  session: SessionService;
};

/**
 * Central place holding all available services.
 * @param override For testing. Replace actual services with fake services during testing.
 * @returns `getService` function for accessing services.
 */
export const ServiceProvider = (override?: Partial<ServiceMap>) => {
  const env = override?.env ?? EnvService();
  const database = override?.database ?? DatabaseService(env);
  const spotify = override?.spotify ?? SpotifyService(env, database);
  const session = override?.session ?? SessionService(env, database);

  const serviceMap: ServiceMap = {
    database,
    env,
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
