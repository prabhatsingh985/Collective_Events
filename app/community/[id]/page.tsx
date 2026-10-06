'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../context/AppContext'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  ShieldCheck,
  Send,
  CornerDownRight,
  Flame,
  Bookmark,
} from 'lucide-react'

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { communityPosts, currentUser, toggleLikePost, addToast, toggleFollowUser } = useApp()

  const post = communityPosts.find((p) => p.id === id) || communityPosts[0]
  const isHW = post.category === 'hot-wheels'

  // Comments State
  const [comments, setComments] = useState([
    {
      id: 'c1',
      authorName: 'Ananya Deshmukh',
      authorUsername: 'ananya_cards',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      authorVerified: true,
      content: 'This custom paint job is unreal! Did you clear coat with 2K urethane or standard automotive gloss? Looks super deep under the lights.',
      createdAt: '2 hours ago',
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 'r1',
          authorName: post.authorName,
          authorUsername: post.authorUsername,
          authorAvatar: post.authorAvatar,
          authorVerified: post.authorVerified,
          content: 'Used 2K automotive clear coat with 3 wet passes! Sanded with 5000 grit micro-mesh between coats for that mirror reflection.',
          createdAt: '1 hour ago',
          likes: 6,
          isLiked: true,
        },
      ],
    },
    {
      id: 'c2',
      authorName: 'Rohit Shenoy',
      authorUsername: 'rohit_redlines',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      authorVerified: true,
      content: 'Bringing my 1969 Redlines to the Mumbai meet. Would love to compare custom wheel tolerances next to your Hakosuka!',
      createdAt: '3 hours ago',
      likes: 8,
      isLiked: false,
      replies: [],
    },
  ])

  const [newComment, setNewComment] = useState('')
  const [replyingToId, setReplyingToId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const commentObj = {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.verified,
      content: newComment,
      createdAt: 'Just now',
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setComments([...comments, commentObj])
    setNewComment('')
    addToast({
      type: 'success',
      title: 'Comment Posted! 💬',
      message: 'Your reply has been added to the discussion.',
    })
  }

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return

    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [
              ...(c.replies || []),
              {
                id: `r-${Date.now()}`,
                authorName: currentUser.name,
                authorUsername: currentUser.username,
                authorAvatar: currentUser.avatar,
                authorVerified: currentUser.verified,
                content: replyText,
                createdAt: 'Just now',
                likes: 0,
                isLiked: false,
              },
            ],
          }
        }
        return c
      })
    )

    setReplyText('')
    setReplyingToId(null)
    addToast({
      type: 'success',
      title: 'Reply Sent! 💬',
      message: 'Your reply has been posted.',
    })
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    addToast({
      type: 'success',
      title: 'Link Copied! 📋',
      message: 'Discussion link copied to clipboard.',
    })
  }

  return (
    <div className="min-h-screen bg-pure-canvas py-10 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Back Link */}
        <div className="flex items-center justify-between border-b border-silver/80 pb-4">
          <Link
            href="/community"
            className="text-xs font-semibold text-slate hover:text-midnight-ink flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Community Feed</span>
          </Link>
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink flex items-center gap-1.5 hover:bg-fog transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-slate" />
            <span>Share Thread</span>
          </button>
        </div>

        {/* Main Post Card */}
        <div className="bg-pure-canvas border border-silver rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
          {/* Author Header */}
          <div className="flex items-center justify-between border-b border-silver/60 pb-4">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.authorUsername}`}>
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-12 h-12 rounded-full object-cover border border-silver"
                />
              </Link>
              <div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/profile/${post.authorUsername}`}
                    className="font-bold text-base text-midnight-ink hover:text-graphite transition-colors"
                  >
                    {post.authorName}
                  </Link>
                  {post.authorVerified && <ShieldCheck className="w-4 h-4 text-spearmint" />}
                  {post.authorBadge && (
                    <span className="px-2 py-0.5 bg-party-pink/30 text-midnight-ink text-[10px] font-bold rounded-full">
                      {post.authorBadge}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate">
                  @{post.authorUsername} · {post.createdAt}
                </span>
              </div>
            </div>

            <Badge variant={isHW ? 'soft-pink' : 'soft-mint'} size="sm">
              {post.category}
            </Badge>
          </div>

          {/* Title & Content */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-midnight-ink tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-slate font-normal leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {post.images.map((img, idx) => (
                <div key={idx} className="relative h-64 sm:h-72 rounded-xl border border-silver overflow-hidden bg-fog">
                  <img src={img} alt="Thread media" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Action Counters */}
          <div className="pt-4 border-t border-silver/60 flex items-center justify-between text-xs font-semibold text-slate">
            <button
              onClick={() => toggleLikePost(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                post.isLiked
                  ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                  : 'bg-pure-canvas text-midnight-ink border-silver hover:border-graphite'
              }`}
            >
              <Heart className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} />
              <span>{post.likesCount} Likes</span>
            </button>

            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-midnight-ink" />
              <span>{comments.length} Comments</span>
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-pure-canvas border border-silver rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <h3 className="font-display font-bold text-lg text-midnight-ink border-b border-silver/60 pb-3">
            Discussion Responses ({comments.length})
          </h3>

          {/* New Comment Box */}
          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a constructive reply to the collector..."
              className="w-full p-3.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="md" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                Submit Reply
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="p-4 bg-fog/50 border border-silver rounded-xl space-y-2.5">
                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={c.authorAvatar} alt={c.authorName} className="w-8 h-8 rounded-full object-cover border border-silver" />
                    <div>
                      <span className="font-bold text-xs text-midnight-ink flex items-center gap-1">
                        {c.authorName}
                        {c.authorVerified && <ShieldCheck className="w-3 h-3 text-spearmint" />}
                      </span>
                      <span className="text-[10px] text-slate">@{c.authorUsername} · {c.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Comment Body */}
                <p className="text-xs text-slate font-normal leading-relaxed">{c.content}</p>

                {/* Reply Trigger */}
                <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate">
                  <button
                    onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                    className="hover:text-midnight-ink flex items-center gap-1 transition-colors"
                  >
                    <CornerDownRight className="w-3 h-3" />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Replying Box */}
                {replyingToId === c.id && (
                  <div className="pt-2 pl-4 border-l-2 border-midnight-ink space-y-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Replying to @${c.authorUsername}...`}
                      className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setReplyingToId(null)}>
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleAddReply(c.id)}>
                        Post Reply
                      </Button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div className="pt-3 pl-4 sm:pl-6 border-l-2 border-silver space-y-2 mt-2">
                    {c.replies.map((r) => (
                      <div key={r.id} className="p-3 bg-pure-canvas rounded-lg border border-silver/80 space-y-1">
                        <div className="flex items-center gap-2">
                          <img src={r.authorAvatar} alt={r.authorName} className="w-6 h-6 rounded-full object-cover border border-silver" />
                          <span className="font-bold text-xs text-midnight-ink flex items-center gap-1">
                            {r.authorName}
                            {r.authorVerified && <ShieldCheck className="w-3 h-3 text-spearmint" />}
                          </span>
                          <span className="text-[10px] text-slate">@{r.authorUsername} · {r.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate font-normal leading-relaxed">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
