import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { NAMES } from "../data";
import type { LoveLetter } from "../types";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const AUTHOR_PREF_KEY = "puja-love-letters-author-pref";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LoveLetters() {
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState<"him" | "her">(
    () => (localStorage.getItem(AUTHOR_PREF_KEY) as "him" | "her") || "her"
  );
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [justSent, setJustSent] = useState(false);

  // Initial fetch + live updates so a letter written on one phone shows
  // up on the other without needing a refresh.
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;

    let cancelled = false;

    const fetchLetters = async () => {
      const { data, error } = await client
        .from("letters")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
      } else {
        setLetters(data ?? []);
      }
      setLoading(false);
    };

    fetchLetters();

    const channel = client
      .channel("letters-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "letters" },
        (payload) => {
          const incoming = payload.new as LoveLetter;
          setLetters((prev) =>
            prev.some((l) => l.id === incoming.id) ? prev : [incoming, ...prev]
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "letters" },
        (payload) => {
          const removedId = (payload.old as { id: string }).id;
          setLetters((prev) => prev.filter((l) => l.id !== removedId));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!justSent) return;
    const t = setTimeout(() => setJustSent(false), 2600);
    return () => clearTimeout(t);
  }, [justSent]);

  const selected = useMemo(
    () => letters.find((l) => l.id === selectedId) ?? null,
    [letters, selectedId]
  );

  const handleAuthorChange = (a: "him" | "her") => {
    setAuthor(a);
    localStorage.setItem(AUTHOR_PREF_KEY, a);
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedBody = body.trim();
    if (!trimmedBody || !supabase) return;
    setSending(true);
    setSendError(null);
    const { data, error } = await supabase
      .from("letters")
      .insert({
        author,
        title: title.trim() || `For ${author === "her" ? NAMES.him : NAMES.her}`,
        body: trimmedBody,
      })
      .select()
      .single();
    setSending(false);
    if (error) {
      setSendError(error.message);
      return;
    }
    if (data) {
      setLetters((prev) => (prev.some((l) => l.id === data.id) ? prev : [data, ...prev]));
      setNewIds((s) => new Set(s).add(data.id));
    }
    setTitle("");
    setBody("");
    setWriting(false);
    setJustSent(true);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm("Delete this letter? This can't be undone.")) return;
    const { error } = await supabase.from("letters").delete().eq("id", id);
    if (error) {
      window.alert(`Couldn't delete: ${error.message}`);
      return;
    }
    setLetters((prev) => prev.filter((l) => l.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  // --- Not configured yet: friendly setup notice instead of a broken screen ---
  if (!isSupabaseConfigured) {
    return (
      <div className="panel">
        <h2>Love Letters</h2>
        <div className="desc">This section needs a database connection to store letters.</div>
        <div className="letters-setup-note">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to a{" "}
          <code>.env</code> file (see the setup notes) and restart the app to turn this on.
        </div>
      </div>
    );
  }

  // --- Detail view: one open letter ---
  if (selected) {
    const isHers = selected.author === "her";
    return (
      <div className="panel">
        <button className="letters-back" onClick={() => setSelectedId(null)}>
          ← Back to letters
        </button>
        <div className={"letter-detail" + (isHers ? " hers" : "")}>
          <div className="letter-detail-head">
            <span className="author-pill">{isHers ? NAMES.her : NAMES.him}</span>
            <span className="letter-date">{formatDate(selected.created_at)}</span>
          </div>
          <h2>{selected.title}</h2>
          <div className="letter-body-scroll">{selected.body}</div>
        </div>
        <button className="letters-delete" onClick={() => handleDelete(selected.id)}>
          Delete this letter
        </button>
      </div>
    );
  }

  // --- Gallery view: grid of envelopes + write form ---
  return (
    <div className="panel">
      <h2>Love Letters</h2>
      <div className="desc">A shared collection, from both of us. Tap an envelope to open it.</div>

      {loading && <div className="letters-status">Loading your letters...</div>}
      {loadError && <div className="letters-status error">Couldn't load letters: {loadError}</div>}

      {!loading && !loadError && letters.length === 0 && (
        <div className="letters-status">No letters yet — be the first to write one.</div>
      )}

      {!loading && letters.length > 0 && (
        <div className="envelope-grid">
          {letters.map((l) => {
            const isHers = l.author === "her";
            return (
              <div
                key={l.id}
                className={"envelope-card" + (isHers ? " hers" : "")}
                onClick={() => setSelectedId(l.id)}
              >
                {newIds.has(l.id) && <span className="new-badge">New</span>}
                <div className="envelope-icon">💌</div>
                <div className="envelope-title">{l.title}</div>
                <div className="envelope-meta">
                  <span className="author-pill">{isHers ? NAMES.her : NAMES.him}</span>
                  <span className="letter-date">{formatDate(l.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {justSent && <div className="letters-toast">Sent 💜 saved for both of you.</div>}

      {!writing ? (
        <button className="spin-btn write-btn" onClick={() => setWriting(true)}>
          + Write a letter
        </button>
      ) : (
        <form className="write-form" onSubmit={handleSend}>
          <div className="author-toggle">
            <span>Writing as:</span>
            <button
              type="button"
              className={"author-toggle-btn" + (author === "him" ? " active" : "")}
              onClick={() => handleAuthorChange("him")}
            >
              {NAMES.him}
            </button>
            <button
              type="button"
              className={"author-toggle-btn" + (author === "her" ? " active" : "")}
              onClick={() => handleAuthorChange("her")}
            >
              {NAMES.her}
            </button>
          </div>
          <input
            className="write-input"
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
          <textarea
            className="write-textarea"
            placeholder="Write what's on your heart..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            required
          />
          {sendError && <div className="letters-status error">Couldn't send: {sendError}</div>}
          <div className="write-actions">
            <button type="button" className="write-cancel" onClick={() => setWriting(false)}>
              Cancel
            </button>
            <button type="submit" className="spin-btn" disabled={!body.trim() || sending}>
              {sending ? "Sending..." : "Send 💌"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
