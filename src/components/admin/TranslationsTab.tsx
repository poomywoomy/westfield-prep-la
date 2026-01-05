import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Search, Edit, Check, Globe, Languages, RefreshCw } from "lucide-react";

interface Translation {
  id: string;
  source_text: string;
  source_hash: string;
  target_language: string;
  translated_text: string;
  is_reviewed: boolean;
  manually_edited: boolean;
  context: string | null;
  created_at: string;
  updated_at: string;
}

interface SupportedLanguage {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  is_active: boolean;
}

export default function TranslationsTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [reviewedFilter, setReviewedFilter] = useState<string>("all");
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [editedText, setEditedText] = useState("");

  // Fetch supported languages
  const { data: languages = [] } = useQuery<SupportedLanguage[]>({
    queryKey: ["supported-languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("supported_languages")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch translations
  const { data: translations = [], isLoading, refetch } = useQuery<Translation[]>({
    queryKey: ["translations", languageFilter, reviewedFilter],
    queryFn: async () => {
      let query = supabase
        .from("translations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (languageFilter !== "all") {
        query = query.eq("target_language", languageFilter);
      }

      if (reviewedFilter === "reviewed") {
        query = query.eq("is_reviewed", true);
      } else if (reviewedFilter === "unreviewed") {
        query = query.eq("is_reviewed", false);
      }

      const { data, error } = await query.limit(200);
      if (error) throw error;
      return data;
    },
  });

  // Update translation mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, translated_text, is_reviewed }: { id: string; translated_text: string; is_reviewed: boolean }) => {
      const { error } = await supabase
        .from("translations")
        .update({ 
          translated_text, 
          is_reviewed, 
          manually_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      toast.success("Translation updated");
      setEditingTranslation(null);
    },
    onError: (error) => {
      toast.error("Failed to update translation: " + error.message);
    },
  });

  // Toggle reviewed status
  const toggleReviewed = useMutation({
    mutationFn: async ({ id, is_reviewed }: { id: string; is_reviewed: boolean }) => {
      const { error } = await supabase
        .from("translations")
        .update({ is_reviewed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["translations"] });
    },
  });

  // Filter translations by search term
  const filteredTranslations = translations.filter((t) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      t.source_text.toLowerCase().includes(search) ||
      t.translated_text.toLowerCase().includes(search)
    );
  });

  // Stats
  const stats = {
    total: translations.length,
    reviewed: translations.filter((t) => t.is_reviewed).length,
    unreviewed: translations.filter((t) => !t.is_reviewed).length,
    manuallyEdited: translations.filter((t) => t.manually_edited).length,
  };

  const getLanguageDisplay = (code: string) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? `${lang.flag_emoji} ${lang.native_name}` : code;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Languages className="h-6 w-6" />
            Translations
          </h2>
          <p className="text-muted-foreground">
            Review and edit auto-translated content
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Translations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.reviewed}</div>
            <p className="text-sm text-muted-foreground">Reviewed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{stats.unreviewed}</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.manuallyEdited}</div>
            <p className="text-sm text-muted-foreground">Manually Edited</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search translations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languages.filter((l) => l.code !== "en").map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.flag_emoji} {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={reviewedFilter} onValueChange={setReviewedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="unreviewed">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Translations Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Check className="h-4 w-4" />
                </TableHead>
                <TableHead>Original (English)</TableHead>
                <TableHead>Translation</TableHead>
                <TableHead className="w-24">Language</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading translations...
                  </TableCell>
                </TableRow>
              ) : filteredTranslations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No translations found. Translations will appear here when visitors view the site in other languages.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTranslations.map((translation) => (
                  <TableRow key={translation.id}>
                    <TableCell>
                      <Checkbox
                        checked={translation.is_reviewed}
                        onCheckedChange={(checked) =>
                          toggleReviewed.mutate({
                            id: translation.id,
                            is_reviewed: !!checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm">{translation.source_text}</p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm">{translation.translated_text}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getLanguageDisplay(translation.target_language)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {translation.is_reviewed ? (
                          <Badge variant="default" className="text-xs">Reviewed</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Pending</Badge>
                        )}
                        {translation.manually_edited && (
                          <Badge variant="outline" className="text-xs">Edited</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTranslation(translation);
                          setEditedText(translation.translated_text);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTranslation} onOpenChange={() => setEditingTranslation(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Translation</DialogTitle>
          </DialogHeader>
          {editingTranslation && (
            <div className="space-y-4">
              <div>
                <Label>Original (English)</Label>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                  {editingTranslation.source_text}
                </div>
              </div>
              <div>
                <Label>Translation ({getLanguageDisplay(editingTranslation.target_language)})</Label>
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              {editingTranslation.context && (
                <div>
                  <Label>Context</Label>
                  <p className="text-sm text-muted-foreground mt-1">{editingTranslation.context}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTranslation(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingTranslation) {
                  updateMutation.mutate({
                    id: editingTranslation.id,
                    translated_text: editedText,
                    is_reviewed: true,
                  });
                }
              }}
              disabled={updateMutation.isPending}
            >
              Save & Mark Reviewed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
