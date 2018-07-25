export class ErrorUtils {
/**
 * 捕捉错误
 * @Picther
 *
 * @static
 * @type {boolean}
 * @memberof ErrorUtils
 */
public static show:boolean=false;
  
    public  static handleError(error,alertCtrl,navCtrl,siginPage) {
      console.log(error);
      console.log(error);
      if(error.status == 401){
        console.info("1" + error.status);
      }else if(error.status == 403){
        console.info("3" + error.status);
      }else if(error.status == 404){
        console.info("4" + error.status);
      }else if(error.status == 500){
        console.info("5" + error.status);
      }else {
        console.info("1" + error.status);
      }
    }

}