import React from 'react';
import {View, TouchableOpacity, Text, Alert}from 'react-native';

import { GLView } from 'expo-gl';
import Expo2DContext from 'expo-2d-context';
import { PanGestureHandler } from 'react-native-gesture-handler'

import SignaturePad from './SignaturePad/signature_pad';

interface CanvasProps{
  onDrawStart:any
  onDrawEnd:any
  onDraw:any

  clear:any
}
class Canvas extends React.Component <CanvasProps>{
  signaturePad:any;
  gestureState:number = 0;
  canvas:any;
  render(){
    return(
      <View style={{flex:1, backgroundColor:'rgb(240,240,240)'}}>
      <PanGestureHandler
        onHandlerStateChange={this.onHandlerStateChange}
        onGestureEvent={this._onPanGestureEvent}>
      <View style={{flex:1}}>
      <GLView
        onLayout={({nativeEvent})=>{this.canvas = nativeEvent.layout}}
        style={{ flex: 1}}
        onContextCreate={this._onGLContextCreate}
      />
      </View>
      </PanGestureHandler>
      </View>
    )
  }
  _handleTouchStart = (nativeEvent:any)=>{
    this.signaturePad._strokeBegin(nativeEvent);
    this.signaturePad._ctx.flush();

    if(this.props.onDrawStart){
      this.props.onDrawStart(nativeEvent);
    }
  }
  _handleTouchMove = (nativeEvent:any)=>{
    this.signaturePad._strokeMoveUpdate(nativeEvent);
    this.signaturePad._ctx.flush();

    if(this.props.onDraw){
      this.props.onDraw(nativeEvent);
    }
  }
  _handleTouchEnd = (nativeEvent:any)=>{
    this.signaturePad._strokeEnd(nativeEvent);
    this.signaturePad._ctx.flush();

    if(this.props.onDrawEnd){
      this.props.onDrawEnd(nativeEvent);
    }
  }

  onHandlerStateChange = ({nativeEvent}:any)=>{
    switch(nativeEvent.state){
      case 2 :
        this._handleTouchStart(nativeEvent)
        break;
      case 5 :
        this._handleTouchEnd(nativeEvent)
        break;
    }
  }
  _onPanGestureEvent = ({nativeEvent}:any)=>{
    switch(nativeEvent.state){
      case 4 :
        this._handleTouchMove(nativeEvent)
        break;
    }
  }
  _onGLContextCreate = (gl:any)=>{
    const ctx = new Expo2DContext(gl, {fastFillTesselation:true});
    this.signaturePad = new SignaturePad(ctx, {screenDimensions:{width:this.canvas.width, height:this.canvas.height}});
  }
}

export default Canvas;
