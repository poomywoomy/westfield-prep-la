import { useEffect, useState } from "react";
import { publishBlogPost } from "@/scripts/publishBlogPost";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PublishBlog() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlePublish = async () => {
    setStatus('loading');
    setMessage('Publishing blog post...');
    
    const result = await publishBlogPost();
    
    if (result.error) {
      setStatus('error');
      setMessage(`Error: ${result.error.message}`);
    } else {
      setStatus('success');
      setMessage('Blog post published successfully!');
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Publish Blog Post</CardTitle>
          <CardDescription>
            Publish "7 Mistakes You're Making with Amazon FBA Prep"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'idle' && (
            <Button onClick={handlePublish} className="w-full">
              Publish Now
            </Button>
          )}
          
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{message}</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span>{message}</span>
              </div>
              <Button onClick={handlePublish} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
