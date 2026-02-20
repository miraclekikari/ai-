export class AudioStreamer {
  private audioCtx: AudioContext;
  private nextStartTime: number = 0;
  private isPlaying: boolean = false;

  constructor(audioCtx: AudioContext) {
    this.audioCtx = audioCtx;
  }

  addPCM16(pcm16Data: Uint8Array) {
    if (!this.isPlaying) {
      this.nextStartTime = this.audioCtx.currentTime + 0.1;
      this.isPlaying = true;
    }

    const float32Data = new Float32Array(pcm16Data.length / 2);
    const dataView = new DataView(pcm16Data.buffer);
    for (let i = 0; i < float32Data.length; i++) {
      float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
    }

    const buffer = this.audioCtx.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start(this.nextStartTime);

    this.nextStartTime += buffer.duration;
  }

  stop() {
    this.isPlaying = false;
    this.nextStartTime = 0;
  }
}
