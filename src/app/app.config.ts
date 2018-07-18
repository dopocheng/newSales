export class AppConfig{
    public static SERVER_URL = "http://localhost:8900";
    public static appUrl():string {
        return AppConfig.SERVER_URL + "/backend-api"
    }
}
