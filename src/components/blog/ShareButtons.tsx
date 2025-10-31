import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Share2, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export const ShareButtons = ({ 
  title, 
  url = window.location.href,
  variant = "default",
  size = "default",
  showLabel = true 
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // User cancelled or error occurred
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant} size={size}>
          <Share2 className="h-4 w-4" />
          {showLabel && <span>Share</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-foreground">Share this article</h4>
          
          {/* Social Media Links */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[#1DA1F2] text-white hover:opacity-90 transition-opacity"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
            
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            
            <a
              href={shareLinks.email}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>

          {/* Copy Link Button */}
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-green-600">Link copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="h-4 w-4 mr-2" />
                Copy link
              </>
            )}
          </Button>

          {/* Native Share (if available) */}
          {navigator.share && (
            <Button
              onClick={nativeShare}
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              More options...
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
