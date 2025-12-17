import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Songs.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const Songs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playingId, setPlayingId] = useState(null);
    const rootRef = useRef(null);

    const updateRootVars = useCallback((x, y) => {
        const el = rootRef.current;
        if (!el) return;
        el.style.setProperty("--mx", x + "px");
        el.style.setProperty("--my", y + "px");
    }, []);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const onMove = (e) => {
            const rect = root.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateRootVars(x, y);
        };
        root.addEventListener("mousemove", onMove);
        return () => root.removeEventListener("mousemove", onMove);
    }, [updateRootVars]);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/getsongs`);
            if (!res.ok) throw new Error("Failed to fetch songs");
            const data = await res.json();
            // map to expected shape
            const mapped = data.map((s) => ({
                id: s._id,
                title: s.title,
                filename: s.filename,
                path: s.path,
                uploadedAt: s.uploadedAt,
            }));
            setSongs(mapped.reverse());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const onSelectFiles = (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;
        setSelectedFiles(files);
        // keep input value so same file can be reselected if needed
        event.target.value = null;
    };

    const uploadSelected = async () => {
        if (!selectedFiles.length) return;
        setLoading(true);
        try {
            for (const file of selectedFiles) {
                const fd = new FormData();
                fd.append('song', file);
                fd.append('title', file.name);
                console.log('Check');
                const res = await fetch(`${BASE_URL}/addsong`, { method: 'POST', body: fd });
                if (!res.ok) {
                    const txt = await res.text();
                    console.error('Upload failed:', txt);
                    continue;
                }
                const json = await res.json();
                const s = json.song || json;
                setSongs((prev) => ([{ id: s._id, title: s.title, filename: s.filename, path: s.path, uploadedAt: s.uploadedAt }, ...prev]));
            }
            setSelectedFiles([]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`songs-root ${playingId ? "playing" : ""}`} ref={rootRef}>
            <h2>Songs</h2>

            <div className="upload-card">
                <input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={onSelectFiles}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <div className="upload-controls">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="choose-btn"
                        disabled={loading}
                    >
                        Choose files
                    </button>
                    <button
                        type="button"
                        onClick={uploadSelected}
                        className="upload-btn"
                        disabled={loading || selectedFiles.length === 0}
                    >
                        Upload
                    </button>
                </div>
                {loading && <div className="loading">Processing...</div>}
                <div className="hint">Files are uploaded to the server and stored in database.</div>

                {selectedFiles.length > 0 && (
                    <div className="selected-list">
                        <div className="selected-title">Selected files:</div>
                        <ul>
                            {selectedFiles.map((f, i) => (
                                <li key={i}>{f.name} ({Math.round(f.size / 1024)} KB)</li>
                            ))}
                        </ul>
                        <button type="button" className="clear-btn" onClick={() => setSelectedFiles([])} disabled={loading}>Clear</button>
                    </div>
                )}
            </div>

            <div className="songs-list">
                {songs.length === 0 && <div className="empty">No songs uploaded yet.</div>}
                {songs.map((song) => (
                    <div className={`song-item ${playingId === song.id ? "is-playing" : ""}`} key={song.id}>
                        <div className="song-meta">
                            <div className="song-name">{song.title || song.filename}</div>
                            <div className="song-date">{new Date(song.uploadedAt).toLocaleString()}</div>
                        </div>
                        <audio
                            controls
                            src={`${API_BASE}${song.path}`}
                            className="audio-player"
                            onPlay={() => setPlayingId(song.id)}
                            onPause={() => setPlayingId((id) => (id === song.id ? null : id))}
                            onEnded={() => setPlayingId((id) => (id === song.id ? null : id))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Songs;