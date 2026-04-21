import { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Feature Components ---
import MatchItem from '../components/scheduleMatch/MatchItem';
import LeaderboardSection from '../components/scheduleMatch/LeaderboardSection';
import CommentSection from '../components/scheduleMatch/CommentSection';

// --- APIs & Types ---
import { eventMatchAPI, commentAPI, leaderboardAPI } from '../api/ScheduleMatchApi';
import type {
  ScheduleMatchResponse,
  ScheduleParticipantResponse,
  Page,
  CommentResponse
} from '../types/ScheduleMatch';

const EventPage = () => {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(
      () => (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light'
  );

  useEffect(() => {
    const onThemeChange = () => {
      const updated = (localStorage.getItem('theme') as 'light' | 'dark') ?? 'light';
      setTheme(updated);
    };
    window.addEventListener('themeChange', onThemeChange);
    return () => window.removeEventListener('themeChange', onThemeChange);
  }, []);

  const isDark = theme === 'dark';

  // Dynamic Styling
  const bgMain = isDark ? 'bg-[#121212]' : 'bg-[#f8fafc]';
  const cardBg = isDark
      ? 'bg-zinc-900/60 backdrop-blur-md border-zinc-800'
      : 'bg-white/80 backdrop-blur-md border-zinc-200';
  const textColor = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const subTextColor = isDark ? 'text-zinc-400' : 'text-zinc-500';

  // Event & Match State
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Data States
  const [pendingMatches, setPendingMatches] = useState<ScheduleMatchResponse[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScheduleParticipantResponse[]>([]);
  const [commentsPage, setCommentsPage] = useState<Page<CommentResponse> | null>(null);

  // UI States
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data Fetching & Handlers
  // Fetch pending matches on initial load
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoadingFeed(true);
        const data = await eventMatchAPI.getPendingMatches();
        setPendingMatches(data);
      } catch (err) {
        console.error("Failed to load live matches:", err); // Fix: Used 'err'
        setError("Failed to load live matches. Please try again later.");
      } finally {
        setIsLoadingFeed(false);
      }
    };
    void fetchMatches(); // Fix: explicitly mark promise as handled
  }, []);

  // Handle clicking a match from the feed
  const handleMatchClick = async (matchId: string) => {
    setSelectedMatchId(matchId);
    try {
      setIsLoadingDetails(true);

      // Fetch Leaderboard & Comments in parallel for performance
      const [leaderboardData, commentsData] = await Promise.all([
        leaderboardAPI.getLeaderboard(matchId),
        commentAPI.getComments(matchId as unknown as number, 0, 20) // Fix: TS2345
      ]);

      setLeaderboard(leaderboardData);
      setCommentsPage(commentsData);
    } catch (err) {
      console.error("Failed to load match details", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  //  Handle returning to the main feed
  const handleBackToFeed = () => {
    setSelectedMatchId(null);
    setLeaderboard([]);
    setCommentsPage(null);
  };

  // Handle voting
  const handleVote = async (universityName: string) => {
    if (!selectedMatchId) return;
    try {
      await eventMatchAPI.voteOnMatch(selectedMatchId, universityName);
      // Immediately refresh leaderboard to reflect the new vote
      const updatedLeaderboard = await leaderboardAPI.getLeaderboard(selectedMatchId);
      setLeaderboard(updatedLeaderboard);
    } catch (err) {
      console.error("Failed to cast vote", err);
      alert("Failed to cast vote. The match might be finished.");
    }
  };

  // Handle posting a comment
  const handlePostComment = async (content: string) => {
    if (!selectedMatchId) return;
    try {
      // NOTE: Replace '1' with your actual logged-in user ID from your Auth context
      const currentUserId = 1;

      await commentAPI.createComment({
        userId: currentUserId,
        matchId: selectedMatchId as unknown as number, // Fix: ESLint unexpected any
        content: content
      });

      // Refresh comments to show the new post
      const updatedComments = await commentAPI.getComments(selectedMatchId as unknown as number, 0, 20); // Fix: TS2345
      setCommentsPage(updatedComments);
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  // Render
  return (
      <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 antialiased">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen">
          <Header />

          <main className={`flex-1 p-6 md:p-8 overflow-y-auto ${bgMain}`}>
            <div className="max-w-5xl mx-auto space-y-8">

              {/* HERO SECTION */}
              <div className={`${cardBg} rounded-2xl p-6 md:p-8 shadow-sm border relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-purple-500/10 rounded-xl">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                    </div>
                    <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${textColor}`}>
                      Live Events & Matchups
                    </h1>
                  </div>
                  <p className={`${subTextColor} text-sm md:text-base font-medium leading-relaxed max-w-2xl`}>
                    The global tournament is officially underway. Participate in live university competitions,
                    cast your votes, and engage with the community in real-time discussion.
                  </p>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {error ? (
                    <div className={`flex flex-col items-center justify-center py-12 ${subTextColor}`}>
                      <AlertCircle className="w-8 h-8 mb-3 text-red-500" />
                      <p>{error}</p>
                    </div>
                ) : selectedMatchId ? (

                    /* ==========================================
                       DETAIL VIEW (Leaderboard & Comments)
                       ========================================== */
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

                      {/* Header: Back Button & Title */}
                      <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={handleBackToFeed}
                            className={`p-2 rounded-full hover:bg-zinc-500/10 transition-colors ${textColor}`}
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className={`text-2xl font-bold ${textColor}`}>
                            {pendingMatches.find(m => m.publicMatchId === selectedMatchId)?.title || "Match Details"}
                          </h2>
                          <span className={`text-sm ${subTextColor}`}>Live Voting Session</span>
                        </div>
                      </div>

                      {/* Loading State or Content */}
                      {isLoadingDetails ? (
                          <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 gap-6">
                            <LeaderboardSection
                                participants={leaderboard}
                                isDark={isDark}
                                onVote={handleVote}
                            />
                            <CommentSection
                                commentsPage={commentsPage}
                                isDark={isDark}
                                onSubmitComment={handlePostComment}
                            />
                          </div>
                      )}
                    </div>

                ) : (

                    /* ==========================================
                       FEED VIEW (List of Pending Matches)
                       ========================================== */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className={`text-xl font-bold ${textColor}`}>Pending Matches</h2>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                        {pendingMatches.length} Live
                      </span>
                      </div>

                      {isLoadingFeed ? (
                          <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                          </div>
                      ) : pendingMatches.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingMatches.map((match) => (
                                <MatchItem
                                    key={match.publicMatchId}
                                    match={match}
                                    isDark={isDark}
                                    onClick={handleMatchClick}
                                />
                            ))}
                          </div>
                      ) : (
                          <div className={`text-center py-16 border rounded-2xl border-dashed ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <p className={subTextColor}>No pending matches at the moment. Check back later!</p>
                          </div>
                      )}
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