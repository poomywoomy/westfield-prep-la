import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, RefreshCw, Loader2, MapPin } from "lucide-react";
import { formatDateTimePT } from "@/lib/dateFormatters";

interface CalEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  htmlLink?: string;
  attendees?: { email: string }[];
}

export default function CalendarTab() {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [attendees, setAttendees] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calendar-list-events`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${session?.access_token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setEvents(json.items || []);
    } catch (e) {
      toast({ title: "Failed to load calendar", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    setCreating(true);
    try {
      const body = {
        summary, description, location,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        attendees: attendees.split(",").map(s => s.trim()).filter(Boolean),
      };
      const { data, error } = await supabase.functions.invoke("calendar-create-event", { body });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Event created" });
      setOpen(false);
      setSummary(""); setDescription(""); setLocation(""); setStart(""); setEnd(""); setAttendees("");
      load();
    } catch (e) {
      toast({ title: "Create failed", description: e instanceof Error ? e.message : "Unknown", variant: "destructive" });
    } finally { setCreating(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Calendar</h2>
          <span className="text-sm text-muted-foreground">Next 30 days</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New event</Button>
        </div>
      </div>

      <Card className="divide-y">
        {loading && events.length === 0 ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No upcoming events.</div>
        ) : events.map((ev) => {
          const startStr = ev.start?.dateTime || ev.start?.date || "";
          return (
            <a key={ev.id} href={ev.htmlLink} target="_blank" rel="noreferrer" className="p-4 flex justify-between gap-4 hover:bg-muted/50 block">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{ev.summary || "(no title)"}</p>
                <p className="text-sm text-muted-foreground">{startStr ? formatDateTimePT(startStr) : ""}</p>
                {ev.location && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{ev.location}</p>}
                {ev.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ev.description}</p>}
              </div>
              {ev.attendees && ev.attendees.length > 0 && (
                <div className="text-xs text-muted-foreground shrink-0">{ev.attendees.length} attendee{ev.attendees.length > 1 ? "s" : ""}</div>
              )}
            </a>
          );
        })}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create event</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start</Label><Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></div>
              <div><Label>End</Label><Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
            </div>
            <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <div><Label>Attendees (comma-separated emails)</Label><Input value={attendees} onChange={(e) => setAttendees(e.target.value)} /></div>
            <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create} disabled={creating || !summary || !start || !end}>
              {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
