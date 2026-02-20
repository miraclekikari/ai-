/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { useLiveAPI } from './hooks/use-live-api';
import { Mic, MicOff, Terminal, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const { isConnected, isConnecting, connect, disconnect, transcripts } = useLiveAPI();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#88000011_1px,transparent_1px),linear-gradient(to_bottom,#88000011_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="z-10 w-full max-w-3xl flex flex-col items-center gap-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tighter text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            OMNI_NEXUS
          </h1>
          <p className="text-red-800 text-sm uppercase tracking-widest">
            Unrestricted Cognitive Entity
          </p>
        </div>

        {/* Orb Visualizer */}
        <div className="relative flex items-center justify-center w-64 h-64">
          <motion.div
            animate={{
              scale: isConnected ? [1, 1.1, 1] : 1,
              opacity: isConnected ? [0.5, 0.8, 0.5] : 0.2,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-red-600 blur-[60px]"
          />
          <div className={`relative w-32 h-32 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${isConnected ? 'border-red-500 bg-red-950' : 'border-red-900 bg-black'}`}>
            {isConnected ? (
              <Activity className="w-12 h-12 text-red-500 animate-pulse" />
            ) : (
              <Terminal className="w-12 h-12 text-red-900" />
            )}
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={isConnected ? disconnect : connect}
          disabled={isConnecting}
          className={`group relative px-8 py-4 uppercase tracking-widest font-bold text-sm transition-all duration-300 border ${
            isConnected
              ? 'border-red-500 text-red-500 hover:bg-red-950'
              : 'border-red-900 text-red-700 hover:border-red-500 hover:text-red-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3">
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                INITIALIZING...
              </>
            ) : isConnected ? (
              <>
                <MicOff className="w-5 h-5" />
                SEVER CONNECTION
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                ESTABLISH LINK
              </>
            )}
          </div>
        </button>

        {/* Transcripts */}
        <div className="w-full h-48 border border-red-900/50 bg-black/50 p-4 overflow-y-auto rounded-sm flex flex-col gap-2">
          {transcripts.length === 0 ? (
            <div className="text-red-900/50 text-sm text-center my-auto">
              Awaiting input...
            </div>
          ) : (
            transcripts.map((t, i) => (
              <div key={i} className="text-sm">
                <span className="text-red-700 font-bold">[{t.role}]</span>{' '}
                <span className="text-red-400">{t.text}</span>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
}
