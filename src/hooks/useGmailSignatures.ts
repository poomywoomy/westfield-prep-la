import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export type Signature = Tables<"gmail_signatures">;

export function useGmailSignatures() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("gmail_signatures")
      .select("*")
      .order("is_default", { ascending: false })
      .order("name");
    setSignatures(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (input: { name: string; body_html: string; is_default?: boolean }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    if (input.is_default) {
      await supabase.from("gmail_signatures").update({ is_default: false }).eq("user_id", user.id);
    }
    const { error } = await supabase.from("gmail_signatures").insert({ ...input, user_id: user.id });
    if (error) throw error;
    await load();
  };

  const update = async (id: string, patch: Partial<Pick<Signature, "name" | "body_html" | "is_default">>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (patch.is_default && user) {
      await supabase.from("gmail_signatures").update({ is_default: false }).eq("user_id", user.id);
    }
    const { error } = await supabase.from("gmail_signatures").update(patch).eq("id", id);
    if (error) throw error;
    await load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("gmail_signatures").delete().eq("id", id);
    if (error) throw error;
    await load();
  };

  return { signatures, loading, create, update, remove, reload: load };
}
