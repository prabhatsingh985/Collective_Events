'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { CommunityPost } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  ShieldCheck,
  Send,
  Image as ImageIcon,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default function CommunityFeedPage() {
  const { communityPosts, currentUser, users, events, createPost, toggleLikePost, votePoll, toggleFollowUser, addToast } = useApp()

  const [activeFilter, setActiveFilter] = useState<'all' | 'showcase' | 'trade' | 'discussion' | 'poll'>('all')
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postType, setPostType] = useState<'showcase' | 'trade' | 'discussion' | 'poll'>('showcase')
  const [postCategory, setPostCategory] = useState<'hot-wheels' | 'football-cards' | 'general'>('hot-wheels')
  const [postImageUrl, setPostImageUrl] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  // Filtered Posts
  const filteredPosts = communityPosts.filter((post) => {
    if (activeFilter !== 'all' && post.postType !== activeFilter) return false
    return true
  })

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!postTitle.trim() || !postContent.trim()) return

    createPost({
      title: postTitle,
      content: postContent,
      category: postCategory,
      postType,
      images: postImageUrl ? [postImageUrl] : [],
      tags: [postCategory === 'hot-wheels' ? 'DieCastDrop' : 'SportsCards', 'CommunityBuzz'],
    })

    setPostTitle('')
    setPostContent('')
    setPostImageUrl('')
    setIsComposerOpen(false)
  }

  const handleSharePost = (id: string) => {
    navigator.clipboard?.writeText(`${window.location.origin}/community/${id}`)
    addToast({
      type: 'success',
      title: 'Link Copied! 📋',
      message: 'Post link copied to clipboard.',
    })
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header with Sky Periwinkle Wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="soft-pink" size="sm">
              Community Agora
            </Badge>
            <span className="text-xs font-semibold text-slate">
              {communityPosts.length} Active Conversations
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-midnight-ink">
            Collector Community Feed
          </h1>
          <p className="text-sm text-slate mt-1 font-normal max-w-xl">
            Showcase your grails and custom builds, negotiate trades, debate rarity grades, and meet local collectors.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Grid: Feed (2 cols) + Sidebar (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Feed Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Composer Card */}
            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-silver/60 flex-shrink-0"
                />
                <button
                  onClick={() => setIsComposerOpen(!isComposerOpen)}
                  className="flex-1 text-left px-4 py-2.5 bg-black/[0.04] hover:bg-black/[0.07] border border-silver/60 rounded-lg text-xs font-medium text-slate hover:text-midnight-ink transition-colors"
                >
                  Share a fresh pull, trade wishlist, or discussion topic...
                </button>
              </div>

              {isComposerOpen && (
                <form onSubmit={handleCreatePost} className="space-y-4 pt-3 border-t border-silver/60">
                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Thread Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="e.g. Finally unboxed the 1999 Nissan Skyline R34 first edition!"
                      className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-midnight-ink block mb-1">
                        Post Type
                      </label>
                      <select
                        value={postType}
                        onChange={(e) => setPostType(e.target.value as any)}
                        className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      >
                        <option value="showcase">📸 Collection Showcase</option>
                        <option value="trade">🤝 Trade Request</option>
                        <option value="discussion">💬 General Discussion</option>
                        <option value="poll">📊 Community Poll</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-midnight-ink block mb-1">
                        Category Tag
                      </label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value as any)}
                        className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      >
                        <option value="hot-wheels">🏎️ Hot Wheels</option>
                        <option value="football-cards">⚽ Football Cards</option>
                        <option value="general">🌐 General Collectibles</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Discussion Content *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Tell the community the story behind your pull or what specific items you are seeking..."
                      className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Optional Photo URL
                    </label>
                    <input
                      type="url"
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => setIsComposerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" size="md" type="submit">
                      Post to Community 🚀
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto bg-fog/70 border border-silver p-1 rounded-full w-fit">
              {[
                { id: 'all', label: 'All Posts' },
                { id: 'showcase', label: '📸 Showcases' },
                { id: 'trade', label: '🤝 Trade Requests' },
                { id: 'discussion', label: '💬 Discussions' },
                { id: 'poll', label: '📊 Polls' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                    activeFilter === tab.id
                      ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                      : 'text-slate hover:text-midnight-ink hover:bg-pure-canvas'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map((post) => {
                const isHW = post.category === 'hot-wheels'

                return (
                  <div
                    key={post.id}
                    className="bg-pure-canvas border border-silver rounded-2xl shadow-card hover:shadow-card-hover transition-all p-5 sm:p-6 space-y-4"
                  >
                    {/* Author Header */}
                    <div className="flex items-center justify-between border-b border-silver/60 pb-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/profile/${post.authorUsername}`}>
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-10 h-10 rounded-full object-cover border border-silver"
                          />
                        </Link>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/profile/${post.authorUsername}`}
                              className="font-bold text-xs text-midnight-ink hover:text-graphite transition-colors"
                            >
                              {post.authorName}
                            </Link>
                            {post.authorVerified && (
                              <ShieldCheck className="w-3.5 h-3.5 text-spearmint" />
                            )}
                            {post.authorBadge && (
                              <span className="px-2 py-0.5 bg-party-pink/30 text-midnight-ink text-[10px] font-bold rounded-full">
                                {post.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate">
                            @{post.authorUsername} · {post.createdAt}
                          </span>
                        </div>
                      </div>

                      <Badge variant={isHW ? 'soft-pink' : 'soft-mint'} size="sm">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Title & Body */}
                    <div className="space-y-2">
                      <Link href={`/community/${post.id}`}>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-midnight-ink hover:text-graphite transition-colors leading-snug">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-slate leading-relaxed font-normal whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Optional Photos Grid */}
                    {post.images.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {post.images.map((img, idx) => (
                          <div key={idx} className="relative h-56 sm:h-64 rounded-xl border border-silver overflow-hidden bg-fog">
                            <img src={img} alt="Post media" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Poll Component */}
                    {post.pollOptions && (
                      <div className="p-4 bg-fog/50 border border-silver rounded-xl space-y-2.5">
                        <span className="text-[11px] font-semibold text-slate uppercase tracking-wider">
                          Community Poll
                        </span>
                        <div className="space-y-2">
                          {post.pollOptions.map((opt) => {
                            const totalVotes = post.pollOptions!.reduce((a, b) => a + b.votes, 0)
                            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
                            const isVoted = post.userVotedPollOption === opt.id

                            return (
                              <button
                                key={opt.id}
                                onClick={() => votePoll(post.id, opt.id)}
                                className={`w-full p-3 rounded-lg border text-left relative overflow-hidden transition-all ${
                                  isVoted
                                    ? 'border-midnight-ink bg-pure-canvas'
                                    : 'border-silver bg-pure-canvas hover:border-graphite'
                                }`}
                              >
                                <div
                                  className="absolute top-0 bottom-0 left-0 bg-party-pink/25 pointer-events-none transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                                <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
                                  <span className="text-midnight-ink">{opt.text}</span>
                                  <span className="text-slate font-display">{pct}% ({opt.votes})</span>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Post Actions Bar */}
                    <div className="pt-3 border-t border-silver/60 flex items-center justify-between text-xs font-medium text-slate">
                      <div className="flex items-center gap-4">
                        {/* Like */}
                        <button
                          onClick={() => toggleLikePost(post.id)}
                          className={`flex items-center gap-1.5 transition-colors ${
                            post.isLiked ? 'text-midnight-ink font-bold' : 'hover:text-midnight-ink'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={post.isLiked ? 'currentColor' : 'none'} />
                          <span>{post.likesCount}</span>
                        </button>

                        {/* Comments */}
                        <Link
                          href={`/community/${post.id}`}
                          className="flex items-center gap-1.5 hover:text-midnight-ink transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.commentsCount} Comments</span>
                        </Link>
                      </div>

                      {/* Share */}
                      <button
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center gap-1 hover:text-midnight-ink transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card space-y-3">
              <h3 className="font-display font-bold text-sm text-midnight-ink flex items-center gap-2 border-b border-silver/60 pb-2.5">
                <TrendingUp className="w-4 h-4 text-midnight-ink" /> Trending Topics
              </h3>
              <div className="space-y-2">
                {[
                  { tag: '#RLCSkylineDrop', count: '142 posts' },
                  { tag: '#PSA10Returns', count: '98 posts' },
                  { tag: '#MatchAttaxCup', count: '84 posts' },
                  { tag: '#BandraSwapMeet', count: '65 posts' },
                  { tag: '#YamalRookieGrail', count: '52 posts' },
                ].map((t) => (
                  <div key={t.tag} className="flex items-center justify-between text-xs font-medium">
                    <span className="text-midnight-ink hover:underline cursor-pointer">
                      {t.tag}
                    </span>
                    <span className="text-slate text-[11px]">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Collectors */}
            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card space-y-3">
              <h3 className="font-display font-bold text-sm text-midnight-ink border-b border-silver/60 pb-2.5">
                Suggested Collectors
              </h3>
              <div className="space-y-3">
                {users.slice(1, 5).map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-2">
                    <Link href={`/profile/${u.username}`} className="flex items-center gap-2 group min-w-0">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-silver flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-midnight-ink group-hover:text-graphite truncate">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate truncate">@{u.username}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleFollowUser(u.username)}
                      className="px-2.5 py-1 rounded-full border border-silver text-[10px] font-bold text-midnight-ink hover:bg-fog flex-shrink-0 transition-colors"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Meets Widget */}
            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card space-y-3">
              <h3 className="font-display font-bold text-sm text-midnight-ink border-b border-silver/60 pb-2.5">
                Meets This Month
              </h3>
              <div className="space-y-2.5">
                {events.slice(0, 3).map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.id}`}
                    className="block p-2.5 bg-fog/50 rounded-xl border border-silver hover:border-midnight-ink transition-colors"
                  >
                    <p className="font-semibold text-xs text-midnight-ink line-clamp-1">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-slate mt-0.5">
                      {evt.city} · {evt.date}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
