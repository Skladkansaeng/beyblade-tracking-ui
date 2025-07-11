"use client";

import type React from "react";

import { useState, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
  Zap,
  Target,
  Flame
} from "lucide-react";
import { BeybladeSpinner } from "@/components/beyblade-spinner";

interface ProcessingStatus {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  message: string;
  outputUrl?: string;
}

export default function VideoProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    status: "idle",
    progress: 0,
    message: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setProcessingStatus({
        status: "idle",
        progress: 0,
        message: ""
      });
    } else {
      alert("Please select a valid video file");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setProcessingStatus({
        status: "uploading",
        progress: 0,
        message: "Launching into Beyblade detection arena..."
      });

      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload directly to external API with progress tracking
      const uploadResponse = await axios.post(
        "/api/beyblade-detection",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setProcessingStatus((prev) => ({
              ...prev,
              progress,
              message: `Launching into battle arena... ${progress}%`
            }));
          },
          responseType: "blob"
        }
      );
      const blobUrl = URL.createObjectURL(uploadResponse.data);
      console.log("🚀 ~ handleUpload ~ uploadResponse:", blobUrl);

      // Processing completed immediately since external API handles it
      setProcessingStatus({
        status: "completed",
        progress: 100,
        message: "Beyblade detection battle completed! Victory achieved!",
        outputUrl:
          blobUrl ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      });
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Launch failed! Prepare for retry!";

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setProcessingStatus({
        status: "error",
        progress: 0,
        message: errorMessage
      });
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setProcessingStatus({
      status: "idle",
      progress: 0,
      message: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusIcon = () => {
    switch (processingStatus.status) {
      case "uploading":
      case "processing":
        return <BeybladeSpinner size="sm" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Target className="h-5 w-5 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Beyblade Video Arena
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Launch, Battle, and Master your video content!
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Target className="h-5 w-5" />
              Launch Your Video
            </CardTitle>
            <CardDescription>
              Select your video to enter the battle arena
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Zap className="h-12 w-12 text-orange-500" />
                <span className="text-lg font-medium text-gray-700">
                  Click to launch your video into battle
                </span>
                <span className="text-sm text-gray-500">
                  Supports MP4, MOV, AVI - All formats ready for battle!
                </span>
              </label>
            </div>

            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpload}
                      disabled={
                        processingStatus.status === "uploading" ||
                        processingStatus.status === "processing"
                      }
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {processingStatus.status === "uploading" ||
                      processingStatus.status === "processing" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Spinning in Arena...
                        </>
                      ) : (
                        <>
                          <Flame className="h-4 w-4 mr-2" />
                          Launch Battle!
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={resetUpload}>
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Processing Status */}
        {processingStatus.status !== "idle" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                {getStatusIcon()}
                Battle Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{processingStatus.message}</span>
                  <span>{processingStatus.progress}%</span>
                </div>
                <Progress
                  value={processingStatus.progress}
                  className="w-full"
                />
              </div>

              {processingStatus.status === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {processingStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              {processingStatus.status === "completed" && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Video processing completed successfully!
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Output Video */}
        {processingStatus.status === "completed" &&
          processingStatus.outputUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Video className="h-5 w-5" />
                  Victory Video
                </CardTitle>
                <CardDescription>
                  Your champion video is ready for download!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-auto"
                    src={processingStatus.outputUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex gap-2">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    <a href={processingStatus.outputUrl} download>
                      <Target className="h-4 w-4 mr-2" />
                      Claim Victory
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetUpload}
                    className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    New Battle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
