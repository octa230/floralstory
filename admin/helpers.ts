import axios, {AxiosError} from "axios";
import { URL } from "./constants";


type SetImageUrlsType = (urls: string[]) => void;
type FileListType = FileList | null;

export const createImageUploader = (onSuccess: (urls: string[]) => void) => {
    return async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(index === 0 ? 'image' : 'images', file);
      });
  
      const response = await axios.post<{ uploaded: string[] }>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      onSuccess(response.data.uploaded);
      return response.data.uploaded;
    };
  };

/* export const createImageUploader= async(setImageUrls: SetImageUrlsType)=>{
    return async (files: FileListType): Promise<string[]> => {
        try {
            if (!files || files.length === 0) {
                throw new Error('No files selected');
            }

            const formData = new FormData();

            Array.from(files).forEach((file: File, index: number) => {
                formData.append(index === 0 ? 'image' : 'images', file);
            });

            const response = await axios.post<{uploaded: string[]}>(`${URL}/upload`, formData, {
                headers:{
                    'Content-Type': 'multipart/form-data',
                }
            })

            if (!response.data) {
                throw new Error('Upload failed: No data returned');
            }

            const uploadedUrls = response.data.uploaded.map(
                (filename: string) => `${URL}/${filename}`
            );
            // Add your upload logic here (e.g., axios request)
            return []; // Placeholder return value
        } catch (error) {
            const err = error as AxiosError | Error;
            console.error('Upload error:', err.message);
            return []; // Ensure a return value in the catch block
        }
    };
}
 */