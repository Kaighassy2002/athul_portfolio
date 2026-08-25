import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addBlogCommentAPI,
  blogEngagementAPI,
  deleteBlogCommentAPI,
  recordBlogShareAPI,
  toggleBlogLikeAPI,
} from "../service/allApi";
import { formatRelativeTime } from "../utils/editorial";
import ShareMenu from "./ShareMenu";
import UserAvatar from "./UserAvatar";
import "../styles/engagement.css";

const GATE_MESSAGE = "Login to interact with this post.";

function insertComment(list, comment) {
  if (!comment.parentId) return [...list, { ...comment, replies: comment.replies || [] }];
  return list.map((item) => {
    if (item.id === comment.parentId) {
      return { ...item, replies: [...(item.replies || []), { ...comment, replies: [] }] };
    }
    return item;
  });
}

function removeComment(list, id) {
  return list
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      replies: (item.replies || []).filter((reply) => reply.id !== id),
    }));
}

function CommentCard({ comment, depth = 0, currentUserId, onReply, onDelete, pendingId }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <article className={`plate-comment ${depth ? "is-reply" : ""}`}>
      <UserAvatar name={comment.user?.name} src={comment.user?.avatar} />
      <div className="plate-comment-body">
        <header>
          <strong>{comment.user?.name || "Reader"}</strong>
          <time dateTime={comment.createdAt}>{formatRelativeTime(comment.createdAt)}</time>
          {comment.approved === false ? <span className="plate-comment-pending">Awaiting approval</span> : null}
        </header>
        <p>{comment.body}</p>
        <div className="plate-comment-actions">
          {depth === 0 && (
            <button type="button" onClick={() => onReply(comment)}>
              Reply
            </button>
          )}
          {comment.mine && (
            <button
              type="button"
              className={confirm ? "is-confirm" : ""}
              disabled={pendingId === comment.id}
              onClick={() => {
                if (!confirm) {
                  setConfirm(true);
                  return;
                }
                onDelete(comment.id);
              }}
            >
              {pendingId === comment.id ? "Removing" : confirm ? "Confirm" : "Remove"}
            </button>
          )}
        </div>
        {comment.replies?.length > 0 && (
          <div className="plate-comment-thread">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                depth={1}
                currentUserId={currentUserId}
                onReply={onReply}
                onDelete={onDelete}
                pendingId={pendingId}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function BlogInteractions({ postId, title }) {
  const {
    user,
    requireAuth,
    openAuth,
    pendingAction,
    consumePendingAction,
  } = useAuth();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [commentBusy, setCommentBusy] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [pulse, setPulse] = useState(false);
  const composerRef = useRef(null);
  const shareBtnRef = useRef(null);
  const ranIntent = useRef("");

  const load = async () => {
    const result = await blogEngagementAPI(postId);
    if (!result.ok) return;
    setLikeCount(result.data.likeCount || 0);
    setLiked(Boolean(result.data.liked));
    setComments(result.data.comments || []);
    setCommentCount(result.data.commentCount || 0);
  };

  useEffect(() => {
    setDraft("");
    setReplyTo(null);
    setShareOpen(false);
    setError("");
    ranIntent.current = "";
    load();
  }, [postId]);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const gate = (type, extra = {}) =>
    requireAuth(
      { type, postId, draft, parentId: replyTo?.id || null, ...extra },
      GATE_MESSAGE
    );

  const toggleLike = async () => {
    if (likeBusy) return;
    setLikeBusy(true);
    setError("");
    const previous = { liked, likeCount };
    setLiked(!liked);
    setLikeCount((count) => count + (liked ? -1 : 1));
    setPulse(true);
    window.setTimeout(() => setPulse(false), 380);
    const result = await toggleBlogLikeAPI(postId);
    if (!result.ok) {
      setLiked(previous.liked);
      setLikeCount(previous.likeCount);
      if (result.status === 401) gate("like");
      else setError(result.message);
    } else {
      setLiked(Boolean(result.data.liked));
      setLikeCount(result.data.likeCount || 0);
    }
    setLikeBusy(false);
  };

  const submitComment = async (text = draft, parentId = replyTo?.id || null) => {
    const body = String(text || "").trim();
    if (!body) {
      composerRef.current?.focus();
      return;
    }
    setCommentBusy(true);
    setError("");
    const result = await addBlogCommentAPI(postId, { body, parentId });
    if (!result.ok) {
      if (result.status === 401) gate("comment", { draft: body, parentId });
      else setError(result.message);
      setCommentBusy(false);
      return;
    }
    setComments((list) => insertComment(list, result.data.comment));
    setCommentCount((count) => count + 1);
    setDraft("");
    setReplyTo(null);
    setCommentBusy(false);
  };

  const onDelete = async (id) => {
    setDeletingId(id);
    const result = await deleteBlogCommentAPI(id);
    if (result.ok) {
      setComments((list) => removeComment(list, id));
      setCommentCount((count) => Math.max(0, count - 1));
    } else {
      setError(result.message);
    }
    setDeletingId("");
  };

  const onLikeClick = () => {
    if (gate("like")) return;
    toggleLike();
  };

  const onCommentClick = () => {
    if (gate("comment")) return;
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const onShareClick = () => {
    if (gate("share")) return;
    setShareOpen((value) => !value);
  };

  const onComposerFocus = () => {
    if (!user) gate("comment");
  };

  const onComposerSubmit = (event) => {
    event.preventDefault();
    if (gate("comment")) return;
    submitComment();
  };

  useEffect(() => {
    if (!user || !pendingAction || pendingAction.postId !== postId) return;
    const key = `${pendingAction.type}:${pendingAction.postId}`;
    if (ranIntent.current === key) return;
    ranIntent.current = key;
    const action = consumePendingAction();
    if (!action) return;

    let cancelled = false;
    (async () => {
      const snapshot = await blogEngagementAPI(postId);
      if (cancelled) return;
      if (snapshot.ok) {
        setLikeCount(snapshot.data.likeCount || 0);
        setLiked(Boolean(snapshot.data.liked));
        setComments(snapshot.data.comments || []);
        setCommentCount(snapshot.data.commentCount || 0);
      }

      if (action.type === "like") {
        if (!snapshot.data?.liked) {
          const result = await toggleBlogLikeAPI(postId);
          if (!cancelled && result.ok) {
            setLiked(Boolean(result.data.liked));
            setLikeCount(result.data.likeCount || 0);
            setPulse(true);
            window.setTimeout(() => setPulse(false), 380);
          }
        }
      } else if (action.type === "comment") {
        if (action.draft) setDraft(action.draft);
        window.setTimeout(() => {
          if (cancelled) return;
          if (action.draft?.trim()) submitComment(action.draft, action.parentId || null);
          else composerRef.current?.focus();
        }, 80);
      } else if (action.type === "share") {
        setShareOpen(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, pendingAction, postId]);

  return (
    <section className="plate-engage" aria-label="Field note interactions">
      <div className="plate-engage-bar">
        <button
          type="button"
          className={`plate-engage-btn ${liked ? "is-liked" : ""} ${pulse ? "is-pulse" : ""}`}
          onClick={onLikeClick}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this note" : "Like this note"}
          disabled={likeBusy}
        >
          <i className="fa-solid fa-heart"></i>
          <span>{likeCount}</span>
          <small>Like{likeCount === 1 ? "" : "s"}</small>
        </button>
        <button type="button" className="plate-engage-btn" onClick={onCommentClick} aria-label="Jump to comments">
          <i className="fa-solid fa-comment"></i>
          <span>{commentCount}</span>
          <small>Comment{commentCount === 1 ? "" : "s"}</small>
        </button>
        <div className="plate-share-wrap">
          <button
            type="button"
            className={`plate-engage-btn ${shareOpen ? "is-open" : ""}`}
            onClick={onShareClick}
            ref={shareBtnRef}
            aria-expanded={shareOpen}
            aria-label="Share this note"
          >
            <i className="fa-solid fa-link"></i>
            <small>Share</small>
          </button>
          <ShareMenu
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            url={typeof window !== "undefined" ? window.location.href : ""}
            title={title}
            anchorRef={shareBtnRef}
            onShared={() => recordBlogShareAPI(postId)}
          />
        </div>
      </div>

      <div className="plate-comments" id="plate-comments">
        <div className="plate-comments-head">
          <p className="notes-kicker">Margin notes</p>
          <h2>
            {commentCount
              ? `${commentCount} comment${commentCount === 1 ? "" : "s"}`
              : "Leave a note"}
          </h2>
        </div>

        <form className="plate-composer" onSubmit={onComposerSubmit}>
          <UserAvatar name={user?.name || "Reader"} src={user?.avatar} />
          <div className="plate-composer-fields">
            {replyTo && (
              <p className="plate-replying">
                Replying to {replyTo.user?.name}
                <button type="button" onClick={() => setReplyTo(null)}>
                  Cancel
                </button>
              </p>
            )}
            <textarea
              ref={composerRef}
              rows="3"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onFocus={onComposerFocus}
              placeholder={
                user ? "A thought, a question, or a quiet aside." : "Login to leave a note."
              }
              maxLength={2000}
            />
            <div className="plate-composer-foot">
              {user ? (
                <button type="submit" className="notes-more-btn" disabled={commentBusy || !draft.trim()}>
                  {commentBusy ? "Filing" : "Leave a note"}
                </button>
              ) : (
                <div className="plate-composer-gate">
                  <button
                    type="button"
                    className="notes-more-btn"
                    onClick={() => gate("comment")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="plate-ghost-btn"
                    onClick={() =>
                      openAuth({
                        mode: "signup",
                        message: GATE_MESSAGE,
                        intent: {
                          type: "comment",
                          postId,
                          draft,
                          parentId: replyTo?.id || null,
                        },
                      })
                    }
                  >
                    Create account
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        {error ? <p className="plate-engage-error">{error}</p> : null}

        {comments.length === 0 ? (
          <p className="plate-comments-empty">No margin notes yet. The plate is still quiet.</p>
        ) : (
          <div className="plate-comment-list">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onReply={(item) => {
                  if (gate("comment")) return;
                  setReplyTo(item);
                  composerRef.current?.focus();
                }}
                onDelete={onDelete}
                pendingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
