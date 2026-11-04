import { LoaderCircle, Camera } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center gap-6 bg-[#121110] px-4 py-12 text-[#f3f0ea]">
      {/* ব্র্যান্ডেড অ্যানিমেটেড স্পিনার ও আইকন */}
      <div className="relative flex items-center justify-center">
        {/* ব্যাকগ্রাউন্ড পিং এফেক্ট (গোল্ডেন/অরেঞ্জ টোন) */}
        <div className="absolute size-20 animate-ping rounded-full bg-[#f59e0b]/20" />
        
        {/* মেইন আইকন বক্স */}
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-[#f59e0b] text-[#121110] shadow-xl transition-all duration-300">
          <Camera className="absolute size-7 animate-pulse opacity-50" />
          <LoaderCircle className="size-8 animate-spin" />
        </div>
      </div>

      {/* ব্র্যান্ড টেক্সট */}
      <div className="space-y-1.5 text-center">
        <h3 className="text-xl font-bold tracking-tight text-[#f3f0ea]">
          StudioSpace লোড হচ্ছে...
        </h3>
        <p className="text-sm text-[#a8a29e]">
          আপনার ক্রিয়েটিভ স্পেস এবং স্টুডিওর ডেটা আনা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন।
        </p>
      </div>

      {/* স্কিলেটন কার্ড গ্রিড (আপনার ওয়েবসাইটের কার্ডের কালার টোন অনুযায়ী) */}
      <div className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex flex-col gap-3 rounded-2xl border border-[#262422] bg-[#1a1816] p-4 shadow-sm"
          >
            {/* ইমেজ স্কিলেটন */}
            <div className="h-44 w-full animate-pulse rounded-xl bg-[#262422]" />
            
            {/* টাইটেল ও ব্যাজ স্কিলেটন */}
            <div className="space-y-2 pt-1">
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#262422]" />
              <div className="h-3 w-2/5 animate-pulse rounded bg-[#262422]" />
            </div>

            {/* ফুটার/প্রাইস স্কিলেটন */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 w-1/3 animate-pulse rounded bg-[#262422]" />
              <div className="h-8 w-24 animate-pulse rounded-full bg-[#262422]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}