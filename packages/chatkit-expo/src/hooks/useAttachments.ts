import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useChatKitContext } from '../context';
import type { Attachment, FilePickerResult } from '../types';

/**
 * Hook for managing file and image attachments
 */
export function useAttachments() {
  const { apiClient } = useChatKitContext();
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Pick an image from the library
   */
  const pickImage = useCallback(async (): Promise<Attachment | null> => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: false,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];

    return {
      type: 'image',
      id: `temp-${Date.now()}`,
      name: asset.fileName || `image-${Date.now()}.jpg`,
      mimeType: asset.mimeType || 'image/jpeg',
      preview: asset.uri,
    };
  }, []);

  /**
   * Take a photo with the camera
   */
  const takePhoto = useCallback(async (): Promise<Attachment | null> => {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
      base64: false,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];

    return {
      type: 'image',
      id: `temp-${Date.now()}`,
      name: asset.fileName || `photo-${Date.now()}.jpg`,
      mimeType: asset.mimeType || 'image/jpeg',
      preview: asset.uri,
    };
  }, []);

  /**
   * Pick a document file
   */
  const pickDocument = useCallback(async (): Promise<Attachment | null> => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];

    return {
      type: 'file',
      id: `temp-${Date.now()}`,
      name: asset.name,
      mimeType: asset.mimeType || 'application/octet-stream',
    };
  }, []);

  /**
   * Upload an attachment to the server
   */
  const uploadAttachment = useCallback(
    async (localAttachment: Attachment): Promise<Attachment> => {
      if (!apiClient) {
        throw new Error('API client is not initialized');
      }

      setIsUploading(true);

      try {
        const uri = localAttachment.type === 'image' ? localAttachment.preview : '';

        // Upload via API client
        const uploaded = await apiClient.uploadFile({
          uri,
          name: localAttachment.name,
          mimeType: localAttachment.mimeType,
        });

        setIsUploading(false);
        return uploaded;
      } catch (error) {
        setIsUploading(false);
        throw error;
      }
    },
    [apiClient],
  );

  return {
    pickImage,
    takePhoto,
    pickDocument,
    uploadAttachment,
    isUploading,
  };
}
