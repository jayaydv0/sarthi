"use client";

import { useState, useRef } from "react";
import { 
  BadgeCheck, 
  Pencil, 
  Share2, 
  Link as LinkIcon, 
  QrCode, 
  Smile, 
  X,
  Loader2,
  UserRound,
  ChevronLeft,
  Upload,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { uploadAvatar, updateAvatarUrl } from "./actions";
import { useRouter } from "next/navigation";

const AVATAR_LIBRARY = [
  { id: 1, url: "/avatars/avatar-1.png", label: "Tech Voyager" },
  { id: 2, url: "/avatars/avatar-2.png", label: "Modern Pro" },
  { id: 3, url: "/avatars/avatar-3.png", label: "Creative Artist" },
  { id: 4, url: "/avatars/avatar-4.png", label: "Future Punk" },
];

interface ProfileImageInteractionProps {
  avatarUrl: string | null;
  name: string;
}

export function ProfileImageInteraction({ avatarUrl, name }: ProfileImageInteractionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name}'s Profile`,
        text: `Check out ${name}'s professional profile on ArchitectOS.`,
        url: window.location.href,
      }).then(() => toast.success("Shared successfully!"))
        .catch(() => handleCopyLink());
    } else {
      handleCopyLink();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatar(formData);
    setIsUploading(false);

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Avatar updated successfully!");
      router.refresh();
      setIsOpen(false);
      setShowLibrary(false);
    }
  };

  const handleLibrarySelect = async (url: string) => {
    setIsUploading(true);
    const result = await updateAvatarUrl(url);
    setIsUploading(false);

    if ("error" in result && result.error) {
      toast.error(result.error);
    } else {
      toast.success("Avatar updated from library!");
      router.refresh();
      setIsOpen(false);
      setShowLibrary(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* Thumbnail Profile Picture */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="h-48 w-48 overflow-hidden rounded-xl shadow-ambient transition-transform duration-300 group-hover:scale-105">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container-highest text-4xl font-bold text-primary">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="absolute -bottom-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-surface-container-low bg-secondary shadow-lg">
          <BadgeCheck
            className="size-4 text-on-secondary"
            strokeWidth={2}
            fill="currentColor"
            aria-hidden
          />
        </div>
      </div>

      {/* Overlay Modal (Instagram Style) */}
      {isOpen && (
        <div className="profile-overlay" onClick={() => { setIsOpen(false); setShowQr(false); setShowLibrary(false); }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); setShowQr(false); setShowLibrary(false); }}
            className="profile-overlay-close z-50"
            aria-label="Close profile view"
          >
            <X className="size-6" />
          </button>

          <div className="relative flex h-full w-full flex-col items-center justify-center p-6" onClick={(e) => e.stopPropagation()}>
             {showLibrary ? (
                /* Avatar Library View (Instagram-like) */
                <div className="flex flex-col items-center w-full max-w-lg animate-in slide-in-from-bottom-8 duration-500">
                    <div className="mb-10 flex items-center justify-between w-full px-4">
                        <button onClick={() => setShowLibrary(false)} className="text-white hover:text-white/70 transition-colors p-2">
                            <ChevronLeft className="size-7" />
                        </button>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white tracking-tight">Personalize Avatar</h3>
                            <p className="text-white/40 text-[0.65rem] uppercase font-bold tracking-[0.2em] mt-1">Select from library</p>
                        </div>
                        <button 
                            onClick={triggerUpload} 
                            className="text-primary hover:text-primary-container transition-colors flex flex-col items-center gap-1 font-bold text-[0.65rem] uppercase tracking-wider"
                        >
                            <Upload className="size-5" />
                            Device
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 w-full px-4">
                        {AVATAR_LIBRARY.map((avatar) => (
                            <button 
                                key={avatar.id}
                                onClick={() => handleLibrarySelect(avatar.url)}
                                disabled={isUploading}
                                className="group relative aspect-square overflow-hidden rounded-[2.5rem] border-4 border-white/5 hover:border-primary transition-all duration-500 shadow-2xl"
                            >
                                <img src={avatar.url} alt={avatar.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="size-4 text-primary" />
                                        <span className="text-white text-sm font-bold tracking-tight">{avatar.label}</span>
                                    </div>
                                </div>
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                        <Loader2 className="size-10 text-white animate-spin" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => setShowLibrary(false)}
                        className="mt-12 text-white/50 hover:text-white text-sm font-medium transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
             ) : showQr ? (
                /* QR Code View */
                <div className="flex flex-col items-center gap-10 animate-in zoom-in duration-300 px-6">
                    <div className="bg-white p-8 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={qrCodeUrl} alt="QR Code" className="size-56" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Scan to visit profile</h3>
                        <p className="text-white/50 text-sm font-medium">Link: {currentUrl.includes("localhost") ? "Local Preview (Scan on same network)" : currentUrl}</p>
                    </div>
                    <button 
                        onClick={() => setShowQr(false)}
                        className="mt-4 px-8 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all active:scale-95"
                    >
                        Return to Profile
                    </button>
                </div>
             ) : (
                /* Profile & Actions View */
                <>
                    <div className="profile-large-avatar-wrap mb-20">
                        <div className="profile-large-avatar overflow-hidden relative border-8 border-white/5 shadow-2xl">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-surface-container-highest text-6xl font-bold text-primary">
                                    {name.slice(0, 1).toUpperCase()}
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                    <Loader2 className="size-12 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <button 
                            className="profile-edit-badge size-14" 
                            onClick={() => setShowLibrary(true)}
                            disabled={isUploading}
                            title="Personalize Avatar"
                        >
                            <Sparkles className="size-6" />
                        </button>
                    </div>

                    {/* Action Row */}
                    <div className="absolute bottom-16 left-0 right-0 flex items-start justify-center gap-8 md:gap-12 px-6">
                        <button className="flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95" onClick={handleShare}>
                            <div className="size-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <UserRound className="size-7" />
                            </div>
                            <span className="text-[0.7rem] font-bold text-white/80 uppercase tracking-widest text-center leading-none">Share<br/>profile</span>
                        </button>

                        <button className="flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95" onClick={handleCopyLink}>
                            <div className="size-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <LinkIcon className="size-7" />
                            </div>
                            <span className="text-[0.7rem] font-bold text-white/80 uppercase tracking-widest text-center leading-none">Copy<br/>link</span>
                        </button>

                        <button className="flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95" onClick={() => setShowQr(true)}>
                            <div className="size-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <QrCode className="size-7" />
                            </div>
                            <span className="text-[0.7rem] font-bold text-white/80 uppercase tracking-widest text-center leading-none">QR<br/>code</span>
                        </button>

                        <button className="flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95" onClick={() => setShowLibrary(true)} disabled={isUploading}>
                            <div className="size-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <Smile className="size-7" />
                            </div>
                            <span className="text-[0.7rem] font-bold text-white/80 uppercase tracking-widest text-center leading-none">Edit<br/>avatar</span>
                        </button>
                    </div>
                </>
             )}
          </div>
        </div>
      )}
    </>
  );
}
