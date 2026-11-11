// screens/AuthCameraScreen.js

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const frames = [
  require('../assets/frame1.png'),
  require('../assets/frame2.png'),
  require('../assets/frame3.png'),
];

export default function AuthCameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [selectedFrame] = useState(frames[Math.floor(Math.random() * frames.length)]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cameraRef = useRef(null);
  const previewRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        setPhotoUri(photo.uri);
        setImageLoaded(false); // 새 이미지 로드 대기
      } catch (error) {
        console.error('사진 촬영 오류:', error);
        Alert.alert('오류', '사진 촬영 중 오류가 발생했습니다.');
      }
    }
  };

  const savePicture = async () => {
    if (!photoUri || !previewRef.current) {
      Alert.alert('오류', '저장할 사진이 없습니다.');
      return;
    }

    // 이미지가 완전히 로드될 때까지 대기
    if (!imageLoaded) {
      Alert.alert('잠시만요', '이미지를 처리중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      if (!mediaLibraryPermission?.granted) {
        const permissionResult = await requestMediaLibraryPermission();
        if (!permissionResult.granted) {
          Alert.alert('권한 필요', '사진을 저장하려면 미디어 라이브러리 접근 권한이 필요합니다.');
          return;
        }
      }

      // 약간의 지연을 주어 모든 렌더링이 완료되도록 함
      await new Promise(resolve => setTimeout(resolve, 500));

      const compositeUri = await captureRef(previewRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
        width: screenWidth * 0.9,
        height: screenHeight * 0.7,
      });

      // 파일이 제대로 생성되었는지 확인
      const fileInfo = await FileSystem.getInfoAsync(compositeUri);
      if (!fileInfo.exists || fileInfo.size === 0) {
        throw new Error('합성된 이미지 파일이 비어있습니다.');
      }

      await MediaLibrary.createAssetAsync(compositeUri);
      Alert.alert('성공', '프레임이 적용된 사진이 갤러리에 저장되었습니다!', [
        { text: '확인', onPress: () => setPhotoUri(null) },
      ]);
    } catch (error) {
      console.error('저장 오류:', error);
      Alert.alert('오류', `저장 실패: ${error.message}`);
    }
  };

  const sharePicture = async () => {
    if (!photoUri || !previewRef.current) {
      Alert.alert('오류', '공유할 사진이 없습니다.');
      return;
    }

    if (!imageLoaded) {
      Alert.alert('잠시만요', '이미지를 처리중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const compositeUri = await captureRef(previewRef.current, {
        format: 'jpg',
        quality: 0.9,
        result: 'tmpfile',
        width: screenWidth * 0.9,
        height: screenHeight * 0.7,
      });

      const fileInfo = await FileSystem.getInfoAsync(compositeUri);
      if (!fileInfo.exists || fileInfo.size === 0) {
        throw new Error('합성된 이미지 파일이 비어있습니다.');
      }

      await Sharing.shareAsync(compositeUri);
    } catch (error) {
      console.error('공유 오류:', error);
      Alert.alert('오류', `공유 실패: ${error.message}`);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>카메라 권한 확인 중...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>카메라 접근 권한이 필요합니다.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>권한 요청</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <View ref={previewRef} style={styles.imageContainer}>
          <Image 
            source={{ uri: photoUri }} 
            style={styles.previewImage}
            onLoad={handleImageLoad}
            onError={(error) => {
              console.error('이미지 로드 오류:', error);
              Alert.alert('오류', '이미지를 불러올 수 없습니다.');
            }}
          />
          <Image 
            source={require('../assets/character.png')} 
            style={styles.characterOverlayPreview} 
            resizeMode="contain"
          />
          <Image 
            source={selectedFrame} 
            style={styles.frameOverlay}
            resizeMode="cover"
          />
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => {
            setPhotoUri(null);
            setImageLoaded(false);
          }}>
            <Text style={styles.buttonText}>다시 찍기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, !imageLoaded && styles.disabledButton]} 
            onPress={savePicture}
            disabled={!imageLoaded}
          >
            <Text style={styles.buttonText}>저장</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, !imageLoaded && styles.disabledButton]} 
            onPress={sharePicture}
            disabled={!imageLoaded}
          >
            <Text style={styles.buttonText}>공유</Text>
          </TouchableOpacity>
        </View>
        {!imageLoaded && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>이미지 처리 중...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing="front"
        onCameraReady={() => setCameraReady(true)}
      />
      <Image 
        source={require('../assets/character.png')} 
        style={styles.characterOverlay}
        resizeMode="contain"
      />
      <Image 
        source={selectedFrame} 
        style={styles.frameOverlay}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={[styles.captureButton, !cameraReady && styles.disabledButton]}
        onPress={takePicture}
        disabled={!cameraReady}
      >
        <Text style={styles.captureButtonText}>{cameraReady ? '촬영' : '준비 중...'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  characterOverlay: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    width: 150,
    height: 150,
    opacity: 0.9,
    zIndex: 2,
  },
  characterOverlayPreview: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    width: 150,
    height: 150,
    opacity: 0.9,
    zIndex: 2,
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.9,
    zIndex: 1,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#ffffffcc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    zIndex: 3,
  },
  disabledButton: {
    backgroundColor: '#ccccccaa',
  },
  captureButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  imageContainer: {
    width: '90%',
    height: '70%',
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});