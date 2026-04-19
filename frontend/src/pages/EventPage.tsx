import { useEffect, useState, type FormEvent } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Sparkles,
  ArrowRight,
  Star,
  MessageSquare,
  ChevronLeft,
  Send,
  Loader2,
  Ghost,
  ThumbsUp,
  Users,
  Clock
} from 'lucide-react';
import { eventMatchAPI, commentAPI } from '../api/eventService';
import type { ScheduleMatchResponse, CommentResponse } from '../types/event';

const EventPage = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light');

  // Data Fetching States
  const [matches, setMatches] = useState<ScheduleMatchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Detail View States
  const [selectedMatch, setSelectedMatch] = useState<ScheduleMatchResponse | null>(null);

  // Comment States
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Voting State
  const [votingFor, setVotingFor] = useState<string | null>(null);

  // Handle Theme
  useEffect(() => {
    const onThemeChange = () => {
      const updated = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(updated);
    };
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  // Fetch Matches
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await eventMatchAPI.getAllMatches();
        setMatches(response.data || []);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMatches();
  }, []);

  // Fetch Comments when a match is selected
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedMatch) return;
      setIsLoadingComments(true);
      try {
        const response = await commentAPI.getComments(selectedMatch.publicMatchId, 0, 50);
        setComments(response.data.content || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    void fetchComments();
  }, [selectedMatch]);

  // Handle Voting
  const handleVote = async (universityName: string) => {
    if (!selectedMatch) return;
    setVotingFor(universityName);
    try {
      await eventMatchAPI.voteOnMatch(selectedMatch.publicMatchId, universityName);

      setSelectedMatch(prev => {
        if (!prev) return prev;
        const updatedParticipants = prev.participants.map(p =>
          p.universityName === universityName
            ? { ...p, totalVotes: p.totalVotes + 1 }
            : p
        );
        return { ...prev, participants: updatedParticipants };
      });

    } catch (error) {
      console.error("Failed to submit vote:", error);
    } finally {
      setVotingFor(null);
    }
  };

  // Handle Comment Submission
  const handleSendComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedMatch) return;

    setIsSubmittingComment(true);
    try {
      const commentRequest = {
        userId: 1, // Ensure this maps to your actual user ID from Auth context
        matchId: selectedMatch.publicMatchId,
        content: newComment
      };

      const response = await commentAPI.createComment(commentRequest);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Status Badge Helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'FINISHED': return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NOT_STARTED': return 'Upcoming';
      case 'PENDING': return 'Live Now';
      case 'FINISHED': return 'Finished';
      default: return status;
    }
  };

  const isDark = theme === 'dark';

  // Aligned dark mode variables strictly with HomePage
  const bgMain = isDark ? 'bg-[#121212]' : 'bg-[#f8fafc]';
  const cardBg = isDark
    ? 'bg-zinc-900/60 backdrop-blur-md border-zinc-800'
    : 'bg-white/80 backdrop-blur-md border-zinc-200';

  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const inputBg = isDark ? 'bg-black/20 border-zinc-800' : 'bg-white border-zinc-300';

  return (
    <div className={`min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 antialiased`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 p-6 md:p-8 overflow-y-auto ${bgMain}`}>
          <div className="max-w-5xl mx-auto space-y-6">

            {/* HERO SECTION */}
            <div className={`${cardBg} rounded-2xl p-6 md:p-8 shadow-sm border relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${textColor}`}>Live Events</h1>
                  </div>
                </div>
                <p className={`${subTextColor} text-sm md:text-base font-medium leading-relaxed max-w-2xl`}>
                  The global tournament is officially underway. Participate in live university competitions, cast your votes, and dominate the global leaderboards today.
                </p>
              </div>
            </div>

            {/* DYNAMIC MATCHES & DISCUSSION SECTION */}
            <div className="pt-2">
              {!selectedMatch ? (
                // --- LIST VIEW ---
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className={`text-lg font-bold tracking-tight ${textColor}`}>Scheduled Matches</h2>
                    {!isLoading && matches.length > 0 && (
                      <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {matches.length} Total
                      </span>
                    )}
                  </div>

                  {isLoading ? (
                    <div className={`flex flex-col items-center justify-center py-16 ${cardBg} rounded-2xl border border-dashed shadow-sm`}>
                      <Loader2 className="w-6 h-6 text-purple-500 animate-spin mb-3" />
                      <p className={`text-sm font-medium ${textColor}`}>Scouting for matches...</p>
                    </div>
                  ) : matches.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${cardBg} rounded-2xl border border-dashed shadow-sm`}>
                      <div className="p-4 bg-zinc-500/5 rounded-full mb-4">
                        <Ghost className="w-8 h-8 text-zinc-400" />
                      </div>
                      <h3 className={`text-lg font-bold mb-1.5 ${textColor}`}>No matches found</h3>
                      <p className={`text-xs ${subTextColor} max-w-sm mx-auto`}>
                        The arena is quiet. Check back later for new scheduled events!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {matches.map((match) => (
                        <div
                          key={match.publicMatchId}
                          onClick={() => setSelectedMatch(match)}
                          className={`${cardBg} p-5 rounded-2xl border hover:border-purple-500/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-5`}
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2.5 mb-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${getStatusColor(match.status)}`}>
                                {getStatusLabel(match.status)}
                              </span>
                              <div className={`flex items-center gap-1.5 text-xs font-semibold ${subTextColor}`}>
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(match.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                              </div>
                            </div>

                            <h3 className={`text-base font-bold mb-1.5 ${textColor} group-hover:text-purple-500 transition-colors`}>
                              {match.title}
                            </h3>

                            <div className={`flex items-center gap-1.5 text-xs font-medium ${subTextColor}`}>
                              <Users className="w-3.5 h-3.5" /> {match.participants?.length || 0} Universities Competing
                            </div>
                          </div>

                          <div className="flex items-center -space-x-2 mr-2">
                            {match.participants?.slice(0, 4).map((p, i) => (
                              <div key={p.publicUniversityId} className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-br from-purple-500 to-blue-500 shadow-sm`} style={{ zIndex: 10 - i }}>
                                {p.universityName.charAt(0)}
                              </div>
                            ))}
                            {(match.participants?.length || 0) > 4 && (
                              <div className={`w-8 h-8 rounded-full border-2 ${isDark ? 'border-[#121212]' : 'border-white'} flex items-center justify-center text-[10px] font-bold text-white bg-zinc-700 shadow-sm`} style={{ zIndex: 5 }}>
                                +{(match.participants?.length || 0) - 4}
                              </div>
                            )}
                          </div>

                          <button className="md:w-10 md:h-10 w-full py-2 md:py-0 rounded-lg md:rounded-full bg-purple-500 text-white flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-[-10px] md:group-hover:translate-x-0 shadow-sm">
                            <span className="md:hidden font-bold text-xs mr-2">View Match</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // --- DETAIL & COMMENTS VIEW ---
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${subTextColor} hover:${textColor} transition-colors mb-1`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Matches
                  </button>

                  {/* Match Header */}
                  <div className={`${cardBg} p-8 md:p-10 rounded-2xl border text-center relative overflow-hidden shadow-sm`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />

                    <span className={`inline-block px-2.5 py-1 rounded-md border font-bold text-[10px] mb-3 tracking-wider uppercase ${getStatusColor(selectedMatch.status)} relative z-10`}>
                      {getStatusLabel(selectedMatch.status)}
                    </span>

                    <h2 className={`text-2xl md:text-3xl font-extrabold mb-8 ${textColor} relative z-10`}>{selectedMatch.title}</h2>

                    {/* Dynamic Participants Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 relative z-10">
                      {selectedMatch.participants?.map((participant) => (
                        <div key={participant.publicUniversityId} className={`flex flex-col items-center p-5 rounded-2xl ${isDark ? 'bg-zinc-800/40' : 'bg-zinc-50'} border ${isDark ? 'border-zinc-700/50' : 'border-zinc-200'} shadow-sm hover:border-purple-500/30 transition-all`}>
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 mb-3 flex items-center justify-center text-xl font-bold text-white shadow-sm">
                            {participant.universityName.charAt(0)}
                          </div>
                          <h3 className={`text-base font-bold text-center mb-1 ${textColor}`}>
                            {participant.universityName}
                          </h3>
                          <div className={`text-xs font-semibold ${subTextColor} mb-4 flex items-center gap-1.5`}>
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />
                            Rank #{participant.rank} • {participant.totalVotes.toLocaleString()} Votes
                          </div>

                          <button
                            onClick={() => handleVote(participant.universityName)}
                            disabled={votingFor === participant.universityName || selectedMatch.status === 'FINISHED'}
                            className="w-full py-2.5 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                          >
                            {votingFor === participant.universityName ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Vote for University"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discussion Section */}
                  <div className={`${cardBg} rounded-2xl border overflow-hidden flex flex-col h-[450px] shadow-sm`}>
                    <div className={`p-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'} flex items-center gap-2 bg-black/5`}>
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      <h3 className={`font-bold text-sm ${textColor}`}>Live Discussion</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                      {isLoadingComments ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        </div>
                      ) : comments.length === 0 ? (
                        <div className={`text-center py-16 flex flex-col items-center`}>
                          <MessageSquare className={`w-10 h-10 mb-3 opacity-20 ${textColor}`} />
                          <p className={`text-xs font-medium ${subTextColor}`}>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.publicCommentId} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0 border border-purple-500/20">
                              {comment.username.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className={`text-xs font-bold ${textColor}`}>{comment.username}</span>
                                <span className={`text-[10px] font-semibold ${subTextColor}`}>
                                  {new Date(comment.commentDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className={`p-3 rounded-xl rounded-tl-none ${isDark ? 'bg-zinc-800/60' : 'bg-zinc-100'} mb-1.5 inline-block max-w-[90%] shadow-sm border ${isDark ? 'border-zinc-700/50' : 'border-transparent'}`}>
                                <p className={`text-xs ${textColor} leading-relaxed`}>{comment.content}</p>
                              </div>
                              <button className={`flex items-center gap-1 text-[10px] font-bold ${subTextColor} hover:text-purple-500 transition-colors`}>
                                <ThumbsUp className="w-3 h-3" /> {comment.likes || 0}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'} ${isDark ? 'bg-black/20' : 'bg-black/5'}`}>
                      <form onSubmit={handleSendComment} className="flex gap-2.5 relative max-w-4xl mx-auto">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts on this matchup..."
                          disabled={isSubmittingComment}
                          className={`flex-1 ${inputBg} rounded-lg px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${textColor} transition-shadow border shadow-sm`}
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          {isSubmittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">Send</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EventPage;