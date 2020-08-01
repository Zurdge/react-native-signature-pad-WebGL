const caps = 10;
interface StrokeCaptureProps{
  size:{width:number, height:number}
}
class StrokeCapture {
  listeners:any;
  points:any;
  strokeCount:any;
  isDown:any;
  strokeInterval:any;
  size:any;
  constructor(props:StrokeCaptureProps) {
    //Listeners
    this.listeners = [];
    //Configure starting params
    this.points = [];
    this.strokeCount = 0;
    this.isDown = false
    // configure the capture params
    this.strokeInterval = 0.025
    this.size = props.size
  }

  reset = ()=>{
    this.points = [];
    this.isDown = false
    this.strokeCount = 0;
  }
  get = ()=>{
    return {
      strokeLength:this.points.length,
      strokeData:this.points,
      strokeCount:this.strokeCount,
    }
  }
  update = (c:any)=>{
    try{
      const l = this.points[this.points.length-1];
      const ll = this.points[this.points.length-2];
      if(this.getDistance(l,c) > this.strokeInterval){
        this.points.push({
          ...c,
          v:this.find_angle(ll,l ,c)
        });
      }
    }catch(e){
      console.log(e)
      this.points.push({
        ...c,
        v:1
      });
      //Set first because theres nothing there
    }
  }
  find_angle = (A:any,B:any,C:any)=>{
      var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
      var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
      var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));

      let val = Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));

      val = ((val * 180) / Math.PI) / 180
      if(isNaN(val)) val = 1;

      return parseFloat(val.toFixed(caps))
  }
  getVector = (posA:any, posB:any)=>{
    var theta = Math.atan2((posB.x - posA.x), (posB.y - posA.y)); // range (-PI, PI]
    theta *= 180 / Math.PI;
    return parseFloat(theta.toFixed(caps));
  }
  getDistance = (posA:any, posB:any)=>{
    var a = posA.x - posB.x;
    var b = posA.y - posB.y;
    return Math.sqrt( a*a + b*b );
  }
  getPosition = (e:any)=>{
    // const rect = e.target.getBoundingClientRect();
    // return {
    //   x:parseFloat(((e.x - rect.left)/rect.width).toFixed(caps)),
    //   y:parseFloat(((e.y - rect.top)/rect.height).toFixed(caps))
    // }
    const out = {
      x:e.x/this.size.width,
      y:e.y/this.size.height
    }
    return out
  }
  mousemove = (e:any)=>{
    const coords = this.getPosition(e);
    if(this.isDown === false) return;
    this.update(coords);
  }
  mousedown = (e:any)=>{
    this.isDown = true;

    const coords = this.getPosition(e);
    this.points.push({
      ...coords,
      v:0
    });
    this.strokeCount += 1;

  }
  mouseup = (e:any)=>{
    this.isDown = false;
  }
}

export default StrokeCapture
//
// interface StrokeCaptureProps{
//   size:{width:number, height:number}
// }
// class StrokeCapture {
//   isDown:any;
//   points:any;
//   size:any;
//   constructor(props:StrokeCaptureProps) {
//     //Configure starting params
//     this.points = [];
//     this.isDown = false
//     //Configure canvas width and height
//     this.size = props.size
//   }
//
//   update = (c:any)=>{
//     try{
//       const l = this.points[this.points.length-1];
//       if(this.getDistance(l,c) > 0.05){
//         this.points.push(c);
//       }
//     }catch(e){
//       //Set first because theres nothing there
//     }
//   }
//
//   getDistance = (posA:any, posB:any)=>{
//     var a = posA.x - posB.x;
//     var b = posA.y - posB.y;
//     return Math.sqrt( a*a + b*b );
//   }
//   getPosition = (e:any)=>{
//     //const rect = e.target.getBoundingClientRect();
//     // return {
//     //   x:parseFloat(((e.x - rect.left)/rect.width).toFixed(2)),
//     //   y:parseFloat(((e.y - rect.top)/rect.height).toFixed(2))
//     // }
//     const out = {
//       x:e.x/this.size.width,
//       y:e.y/this.size.height
//     }
//     return out
//   }
//   mousemove = (e:any)=>{
//     const coords = this.getPosition(e);
//     if(this.isDown === false) return;
//     this.update(coords);
//   }
//   mousedown = (e:any)=>{
//     this.isDown = true;
//
//     const coords = this.getPosition(e);
//     this.points.push(coords);
//   }
//   mouseup = (e:any)=>{
//     this.isDown = false;
//   }
// }
//
// export default StrokeCapture
