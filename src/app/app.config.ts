export class AppConfig {
    public static SERVER_URL = "http://localhost:8100";

    public static appUrl(): string {
        return AppConfig.SERVER_URL + "/backend-api";
    }

    /**
     * 调用挨批后台路径
     * @pitcher
     * @static
     * @returns {string} 
     * @memberof AppConfig
     */
    public static apiUrl(): string {
        return AppConfig.appUrl() + "/v1/api";
    }

    //调用 token
  public static tokenUrl():string {
    return AppConfig.appUrl()+"/oauth/token";
  }
}
