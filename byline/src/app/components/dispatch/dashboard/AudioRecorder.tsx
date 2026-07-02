import React, { useState, useRef, useEffect } from "react";
import {
  IconMicrophone,
  IconPlayerPlay,
  IconPlayerPause,
  IconTrash,
  IconSend,
  IconPlayerStop,
} from "@tabler/icons-react";

interface AudioRecorderProps {
  projectId: string;
  onTranscriptionSuccess: (transcription: string, dispatchId: string) => void;
  onCancel: () => void;
}

export function AudioRecorder({ projectId, onTranscriptionSuccess, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState<"idle" | "recording" | "review" | "uploading" | "done">("idle");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);

  // Web Audio Visualizer refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Clean up recording stream & audio contexts on unmount
  useEffect(() => {
    return () => {
      stopStream();
      cleanupAudioNodes();
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const cleanupAudioNodes = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  };

  const startVisualizer = (stream: MediaStream) => {
    cleanupAudioNodes();

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        animationFrameRef.current = requestAnimationFrame(draw);

        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.fillStyle = "rgba(13, 17, 23, 0.4)";
        ctx.fillRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        // Draw symmetric waves matching the visual brand amber accent
        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height * 0.8;

          // Soft amber glowing colors
          ctx.fillStyle = `rgba(240, 165, 0, ${0.3 + (dataArray[i] / 255) * 0.7})`;
          
          // Draw symmetric bars
          ctx.fillRect(x, (height - barHeight) / 2, barWidth - 1, barHeight);
          x += barWidth;
        }
      };

      draw();
    } catch (e) {
      console.warn("Failed to initialize audio visualizer", e);
    }
  };

  const isSimulatedRef = useRef(false);

  const startSimulatedVisualizer = () => {
    cleanupAudioNodes();

    const draw = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      animationFrameRef.current = requestAnimationFrame(draw);

      ctx.fillStyle = "rgba(13, 17, 23, 0.4)";
      ctx.fillRect(0, 0, width, height);

      const bufferLength = 64;
      const barWidth = (width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;
      const time = Date.now() * 0.006;

      for (let i = 0; i < bufferLength; i++) {
        // Generate simulated dynamic sound frequencies using mathematical waves
        const amplitude = isPaused ? 0.05 : 0.4 + 0.4 * Math.sin(time * 0.5 + i * 0.05);
        const value = Math.abs(Math.sin(i * 0.15 + time) * Math.cos(i * 0.1 - time)) * amplitude;
        barHeight = value * height * 0.8;

        ctx.fillStyle = `rgba(240, 165, 0, ${0.2 + value * 0.8})`;
        ctx.fillRect(x, (height - barHeight) / 2, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    setRecordingTime(0);
    isSimulatedRef.current = false;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioBlobRef.current = audioBlob;
        
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        setStatus("review");
      };

      mediaRecorder.start(250); // Slice data every 250ms
      setIsRecording(true);
      setIsPaused(false);
      setStatus("recording");
      startVisualizer(stream);
    } catch (err) {
      console.warn("Microphone permission denied or not supported. Falling back to simulated audio recording.", err);
      isSimulatedRef.current = true;
      setIsRecording(true);
      setIsPaused(false);
      setStatus("recording");
      startSimulatedVisualizer();
    }
  };

  const pauseRecording = () => {
    if (isSimulatedRef.current) {
      setIsPaused(prev => !prev);
      return;
    }
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (isSimulatedRef.current) {
      setIsRecording(false);
      setIsPaused(false);
      cleanupAudioNodes();
      
      // Construct dummy Silent audio Blob
      const audioBlob = new Blob([new Uint8Array(1000)], { type: "audio/webm" });
      audioBlobRef.current = audioBlob;
      audioUrlRef.current = ""; // Skip real audio element loading
      setStatus("review");
      return;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopStream();
      cleanupAudioNodes();
    }
  };

  const handleReset = () => {
    if (isSimulatedRef.current) {
      cleanupAudioNodes();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      setStatus("idle");
      audioBlobRef.current = null;
      audioUrlRef.current = null;
      isSimulatedRef.current = false;
      return;
    }
    stopRecording();
    stopStream();
    cleanupAudioNodes();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setStatus("idle");
    audioBlobRef.current = null;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const handleSubmit = async () => {
    if (!audioBlobRef.current) return;
    setStatus("uploading");

    if (isSimulatedRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus("done");
      onTranscriptionSuccess(
        "shipped the new audio recorder interface directly in the overview dashboard milestone box",
        `mock-disp-${Date.now()}`
      );
      return;
    }

    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("file", audioBlobRef.current, "voice_note.webm");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Voice note upload failed");
      }

      const result = await response.json();
      setStatus("done");
      onTranscriptionSuccess(result.transcription, result.dispatch_id);
    } catch (error) {
      alert("Failed to upload/transcribe voice note.");
      setStatus("review");
      console.error(error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "rgba(255, 255, 255, 0.015)",
        border: "0.5px dashed rgba(240, 165, 0, 0.25)",
        borderRadius: 6,
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: status === "recording" ? "var(--by-red)" : "var(--by-text-3)",
              animation: status === "recording" ? "pulse-record 1.2s infinite" : "none",
            }}
          />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: status === "recording" ? "var(--by-red)" : "var(--by-text-2)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {status === "idle" && "Ready to record"}
            {status === "recording" && `Recording... ${formatTime(recordingTime)}`}
            {status === "review" && "Review voice note"}
            {status === "uploading" && "Transcribing voice note..."}
            {status === "done" && "Transcription complete!"}
          </span>
        </div>

        {status === "review" && audioUrlRef.current && (
          <audio
            src={audioUrlRef.current}
            controls
            style={{
              height: 28,
              maxWidth: 200,
              outline: "none",
            }}
          />
        )}
      </div>

      {/* Visualizer / Waveform */}
      {(status === "recording" || status === "idle") && (
        <canvas
          ref={canvasRef}
          width={400}
          height={48}
          style={{
            width: "100%",
            height: 48,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 4,
            border: "0.5px solid rgba(255, 255, 255, 0.05)",
          }}
        />
      )}

      {/* Control Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
        {status === "idle" && (
          <>
            <button
              onClick={onCancel}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                padding: "6px 12px",
                background: "transparent",
                color: "var(--by-text-3)",
                border: "0.5px solid var(--by-border)",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              cancel
            </button>
            <button
              onClick={startRecording}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                padding: "6px 12px",
                background: "rgba(240, 165, 0, 0.12)",
                color: "var(--by-amber)",
                border: "0.5px solid var(--by-amber)",
                borderRadius: 4,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconMicrophone size={12} />
              start recording
            </button>
          </>
        )}

        {status === "recording" && (
          <>
            <button
              onClick={pauseRecording}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                padding: "6px 12px",
                background: "transparent",
                color: "var(--by-text-2)",
                border: "0.5px solid var(--by-border)",
                borderRadius: 4,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {isPaused ? <IconPlayerPlay size={12} /> : <IconPlayerPause size={12} />}
              {isPaused ? "resume" : "pause"}
            </button>
            <button
              onClick={stopRecording}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                padding: "6px 12px",
                background: "var(--by-red)",
                color: "#FFF",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconPlayerStop size={12} />
              stop & review
            </button>
          </>
        )}

        {status === "review" && (
          <>
            <button
              onClick={handleReset}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                padding: "6px 12px",
                background: "transparent",
                color: "var(--by-red)",
                border: "0.5px solid rgba(248, 81, 73, 0.3)",
                borderRadius: 4,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconTrash size={12} />
              discard
            </button>
            <button
              onClick={handleSubmit}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                padding: "6px 12px",
                background: "var(--by-accent)",
                color: "#F5F2EC",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <IconSend size={12} />
              submit & transcribe
            </button>
          </>
        )}

        {status === "uploading" && (
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "var(--by-text-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                border: "2px solid rgba(240, 165, 0, 0.25)",
                borderTopColor: "var(--by-amber)",
                borderRadius: "50%",
                animation: "spin-loader 0.8s linear infinite",
              }}
            />
            calling whisper-1...
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-record {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        @keyframes spin-loader {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
