export class FileUtils {

  /**
   * 计算图片的尺寸，根据尺寸压缩
   * 1. iphone手机html5上传图片方向问题，借助exif.js
   * 2. 安卓UC浏览器不支持 new Blob()，使用BlobBuilder
   * @param {Object} _img   图片
   * @param {Number} _orientation 照片信息
   * @return {String}    压缩后base64格式的图片
   */
public static compress(_img) {
    //2.计算符合目标尺寸宽高值，若上传图片的宽高都大于目标图，对目标图等比压缩；如果有一边小于，对上传图片等比放大。
    var _goalWidth = 750,     //目标宽度
      _goalHeight = 750,     //目标高度
      _imgWidth = _img.naturalWidth,  //图片宽度
      _imgHeight = _img.naturalHeight, //图片高度
      _tempWidth = _imgWidth,   //放大或缩小后的临时宽度
      _tempHeight = _imgHeight,   //放大或缩小后的临时宽度
      _r = 0;       //压缩比

    if(_imgWidth === _goalWidth && _imgHeight === _goalHeight) {

    } else if(_imgWidth > _goalWidth && _imgHeight > _goalHeight) {//宽高都大于目标图，需等比压缩
      _r = _imgWidth / _goalWidth;
      if(_imgHeight / _goalHeight < _r) {
        _r = _imgHeight / _goalHeight;
      }
      _tempWidth = Math.ceil(_imgWidth / _r);
      _tempHeight = Math.ceil(_imgHeight / _r);
    } else {
      if(_imgWidth < _goalWidth && _imgHeight < _goalHeight) {//宽高都小于
        _r = _goalWidth / _imgWidth;
        if(_goalHeight / _imgHeight < _r) {
          _r = _goalHeight / _imgHeight;
        }
      } else {
        if(_imgWidth < _goalWidth) {   //宽小于
          _r = _goalWidth / _imgWidth;
        } else{        //高小于
          _r = _goalHeight / _imgHeight;
        }
      }

      _tempWidth = Math.ceil(_imgWidth * _r);
      _tempHeight = Math.ceil(_imgHeight * _r);
    }

    //3.利用canvas对图片进行裁剪，等比放大或缩小后进行居中裁剪
    var _canvas = document.createElement('canvas');
    if(!_canvas.getContext) return;

    var _context = _canvas.getContext('2d');
    _canvas.width = _tempWidth;
    _canvas.height = _tempHeight;
    var _degree;

    // //ios bug，iphone手机上可能会遇到图片方向错误问题
    // switch(_orientation){
    //   //iphone横屏拍摄，此时home键在左侧
    //   case 3:
    //     _degree=180;
    //     _tempWidth=-_imgWidth;
    //     _tempHeight=-_imgHeight;
    //     break;
    //   //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
    //   case 6:
    //     _canvas.width=_imgHeight;
    //     _canvas.height=_imgWidth;
    //     _degree=90;
    //     _tempWidth=_imgWidth;
    //     _tempHeight=-_imgHeight;
    //     break;
    //   //iphone竖屏拍摄，此时home键在上方
    //   case 8:
    //     _canvas.width=_imgHeight;
    //     _canvas.height=_imgWidth;
    //     _degree=270;
    //     _tempWidth=-_imgWidth;
    //     _tempHeight=_imgHeight;
    //     break;
    // }
    if(window.navigator.userAgent.indexOf('iphone') > 0 && !!_degree) {
      _context.rotate(_degree*Math.PI/180);
      _context.drawImage(_img, 0, 0, _tempWidth, _tempHeight);
    } else {
      _context.drawImage(_img, 0, 0, _tempWidth, _tempHeight);
    }
    //toDataURL方法，可以获取格式为"data:image/png;base64,***"的base64图片信息；
    var _data = _canvas.toDataURL('image/jpeg');
    return _data;
  }
}
