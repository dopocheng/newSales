export class AppConfig {
    public static SERVER_URL = "http://localhost:8100";

    public static appUrl(): string {
        return AppConfig.SERVER_URL + "/backend-api";
    }

    //api调用URL
    public static apiUrl(): string {
        return AppConfig.appUrl() + "/v1/api";
    }

    //api调用URL
  public static tokenUrl():string {
    return AppConfig.appUrl()+"/oauth/token";
  }
}
