/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { generateLogo, generateVideo, fetchVideoUrl } from './services/gemini';
import { Button, Card, Input, TextArea, Label } from './components/ui';
import { Loader2, Upload, Play, Download, Sparkles, Image as ImageIcon, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [logoPrompt, setLogoPrompt] = useState('');
  const [logoSize, setLogoSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  
  const [videoPrompt, setVideoPrompt] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateLogo = async () => {
    if (!logoPrompt) return;
    setIsGeneratingLogo(true);
    setGeneratedLogo(null);
    setGeneratedVideoUrl(null); // Reset video if new logo
    try {
      const base64 = await generateLogo(logoPrompt, logoSize);
      setGeneratedLogo(base64);
    } catch (error) {
      console.error(error);
      alert('Failed to generate logo. Please try again.');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneratedLogo(reader.result as string);
        setGeneratedVideoUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!generatedLogo) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    try {
      const uri = await generateVideo(generatedLogo, videoPrompt, videoAspectRatio);
      const url = await fetchVideoUrl(uri);
      setGeneratedVideoUrl(url);
    } catch (error) {
      console.error(error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-12 border-b-4 border-black pb-6">
        <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.8]">
          Logo<span className="text-[#00FF00]">Motion</span>
        </h1>
        <p className="font-mono mt-4 text-lg font-bold tracking-widest uppercase">
          AI-Powered Brand Identity System
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION 1: CREATE */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-display text-6xl text-gray-300">01</span>
            <h2 className="font-display text-4xl uppercase">Design</h2>
          </div>

          <Card className="h-full flex flex-col gap-6">
            <div>
              <Label>Prompt</Label>
              <TextArea 
                placeholder="A minimalist geometric fox head, orange and black, vector style..."
                rows={4}
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Resolution</Label>
                <select 
                  className="w-full bg-white border-2 border-black px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF00]"
                  value={logoSize}
                  onChange={(e) => setLogoSize(e.target.value as any)}
                >
                  <option value="1K">1K (Standard)</option>
                  <option value="2K">2K (High)</option>
                  <option value="4K">4K (Ultra)</option>
                </select>
              </div>
              <div className="flex items-end">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleGenerateLogo} 
              disabled={isGeneratingLogo || !logoPrompt}
              className="w-full"
            >
              {isGeneratingLogo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Logo
                </>
              )}
            </Button>

            <div className="mt-4 border-2 border-dashed border-gray-300 min-h-[300px] flex items-center justify-center bg-gray-50 relative overflow-hidden group">
              {generatedLogo ? (
                <img 
                  src={generatedLogo} 
                  alt="Generated Logo" 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="font-mono text-xs uppercase">No Image Selected</p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* SECTION 2: ANIMATE */}
        <section>
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-display text-6xl text-gray-300">02</span>
            <h2 className="font-display text-4xl uppercase">Animate</h2>
          </div>

          <Card className="h-full flex flex-col gap-6 relative">
            {!generatedLogo && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center border-2 border-black m-[-2px]">
                <p className="font-mono font-bold uppercase bg-black text-white px-4 py-2">
                  Complete Step 01 First
                </p>
              </div>
            )}

            <div>
              <Label>Animation Prompt (Optional)</Label>
              <Input 
                placeholder="Spinning 3D rotation with glowing edges..."
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
              />
            </div>

            <div>
                <Label>Aspect Ratio</Label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setVideoAspectRatio('16:9')}
                        className={`border-2 border-black p-3 flex flex-col items-center gap-2 transition-colors ${videoAspectRatio === '16:9' ? 'bg-[#00FF00]' : 'bg-white hover:bg-gray-50'}`}
                    >
                        <div className="w-8 h-5 border border-current bg-current/10"></div>
                        <span className="font-mono text-xs font-bold">16:9</span>
                    </button>
                    <button 
                        onClick={() => setVideoAspectRatio('9:16')}
                        className={`border-2 border-black p-3 flex flex-col items-center gap-2 transition-colors ${videoAspectRatio === '9:16' ? 'bg-[#00FF00]' : 'bg-white hover:bg-gray-50'}`}
                    >
                        <div className="w-5 h-8 border border-current bg-current/10"></div>
                        <span className="font-mono text-xs font-bold">9:16</span>
                    </button>
                </div>
            </div>

            <Button 
              onClick={handleGenerateVideo} 
              disabled={isGeneratingVideo || !generatedLogo}
              className="w-full"
            >
              {isGeneratingVideo ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rendering Video...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 mr-2" />
                  Animate Logo
                </>
              )}
            </Button>

            <div className="mt-4 border-2 border-black bg-black min-h-[300px] flex items-center justify-center relative overflow-hidden">
              {generatedVideoUrl ? (
                <video 
                  src={generatedVideoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-600">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="font-mono text-xs uppercase">Waiting for render</p>
                </div>
              )}
            </div>
            
            {generatedVideoUrl && (
                <a href={generatedVideoUrl} download="logo-motion.mp4" className="w-full">
                    <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                    </Button>
                </a>
            )}
          </Card>
        </section>
      </div>

      <footer className="mt-12 border-t-2 border-black pt-6 flex justify-between items-center font-mono text-xs uppercase text-gray-500">
        <p>Powered by Gemini 3 Pro & Veo</p>
        <p>Logo Motion v1.0</p>
      </footer>
    </div>
  );
}

