import { Radio } from "lucide-react";

interface LiveStreamCardProps {
  channelName: string;
  title: string;
  videoId?: string;
}

export default function LiveStreamCard({ channelName, title, videoId }: LiveStreamCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-red-600 text-xs font-bold px-2 py-1 rounded-full">
            <Radio size={12} className="animate-pulse" />
            مباشر
          </span>
          <span className="text-sm font-semibold">{channelName}</span>
        </div>
      </div>

      <div className="relative aspect-video bg-black">
        {videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm px-4 text-center">
            بانتظار رابط البث المباشر لهذه القناة
          </div>
        )}
      </div>
    </div>
  );
}