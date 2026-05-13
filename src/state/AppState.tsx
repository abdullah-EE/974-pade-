import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { mockCoaches } from '@/data/mockCoaches';
import { mockVideos } from '@/data/mockVideos';
import { mockCosmetics, mockWallet } from '@/data/mockWallet';
import { challenges as initialChallenges, courts as initialCourts, matches as initialMatches, openGames as initialOpenGames, players as initialPlayers } from '@/data/mockData';
import { accountService } from '@/services/accountService';
import { rankingService } from '@/services/rankingService';
import { Coach } from '@/types/Coach';
import { VideoPost } from '@/types/VideoPost';
import { CosmeticItem, Wallet } from '@/types/Wallet';
import { Area, Challenge, ChallengeStatus, Court, Level, LocalAccount, Match, MatchStatus, OpenGame, Player } from '@/types/models';
import { canRunAction } from '@/utils/rateLimit';
import { sanitizeText } from '@/utils/validation';

interface CreateChallengeInput {
  opponentId?: string;
  opponentIds?: string[];
  courtId: string;
  startsAt: string;
  level: Level;
  note?: string;
  privacy?: Challenge['privacy'];
  type?: Challenge['type'];
}

interface AppStateValue {
  account: LocalAccount | null;
  currentUser: Player;
  players: Player[];
  courts: Court[];
  openGames: OpenGame[];
  challenges: Challenge[];
  matches: Match[];
  coaches: Coach[];
  videos: VideoPost[];
  wallet: Wallet;
  cosmetics: CosmeticItem[];
  activeCosmeticIds: string[];
  friendIds: string[];
  createAccount: (account: LocalAccount) => void;
  loginAccount: (usernameOrEmail: string) => Promise<boolean>;
  updateAccount: (patch: Partial<LocalAccount>) => void;
  addFriend: (id: string) => void;
  removeFriend: (id: string) => void;
  joinOpenGame: (id: string) => void;
  createChallenge: (input: CreateChallengeInput) => Challenge;
  updateChallenge: (id: string, status: ChallengeStatus) => void;
  addMatch: (match: Match) => void;
  updateMatchStatus: (id: string, status: MatchStatus) => void;
  requestCoachSession: (id: string, slot: string) => void;
  toggleVideoLike: (id: string) => void;
  toggleVideoSave: (id: string) => void;
  previewCosmetic: (id: string) => void;
  selectCosmetic: (id: string) => void;
  buyCosmetic: (id: string) => boolean;
  earnCredits: (amount: number, reason: Wallet['transactions'][number]['reason']) => void;
  createCoachProfile: (input: Omit<Coach, 'id' | 'rating' | 'requested'>) => Coach;
  uploadVideo: (input: Omit<VideoPost, 'id' | 'creatorId' | 'creatorName' | 'views' | 'createdAt'>) => VideoPost;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function favoriteCourtForArea(courts: Court[], area: Area) {
  return courts.find((court) => court.area === area)?.id || courts[0].id;
}

function accountToPlayer(account: LocalAccount, base: Player, courts: Court[]): Player {
  const favoriteCourtId = account.favoriteCourtId || favoriteCourtForArea(courts, account.favoriteArea);
  return {
    ...base,
    id: account.id || base.id,
    name: account.name.trim(),
    username: account.username.startsWith('@') ? account.username.trim() : `@${account.username.trim()}`,
    avatar: account.avatarUri || account.avatarUrl || base.avatar,
    avatarUrl: account.avatarUri || account.avatarUrl || base.avatarUrl,
    level: account.level,
    area: account.favoriteArea,
    club: account.favoriteArea,
    favoriteCourtId,
    rating: account.rating || base.rating,
    weeklyPoints: account.weeklyPoints || base.weeklyPoints,
    verifiedMatches: account.verifiedMatches || base.verifiedMatches,
  };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [courts] = useState<Court[]>(initialCourts);
  const [openGames, setOpenGames] = useState<OpenGame[]>(initialOpenGames);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [coaches, setCoaches] = useState<Coach[]>(mockCoaches);
  const [videos, setVideos] = useState<VideoPost[]>(mockVideos);
  const [wallet, setWallet] = useState<Wallet>(mockWallet);
  const [cosmetics, setCosmetics] = useState<CosmeticItem[]>(mockCosmetics);
  const [activeCosmeticIds, setActiveCosmeticIds] = useState<string[]>(['classic-maroon', 'maroon-card']);
  const [friendIds, setFriendIds] = useState<string[]>(['p2', 'p5', 'p11']);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([accountService.getAccount(), accountService.getFriendIds()])
      .then(([storedAccount, storedFriendIds]) => {
        if (!active) return;
        if (storedAccount) setAccount(storedAccount);
        if (storedFriendIds) setFriendIds(storedFriendIds);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const players = useMemo(() => {
    const list = account ? [accountToPlayer(account, initialPlayers[0], courts), ...initialPlayers.slice(1)] : initialPlayers;
    return list.map((player) => ({
      ...player,
      avatarUrl: player.avatarUrl || player.avatar,
      area: player.area || player.club,
      isVerified: player.isVerified ?? player.verified,
      isFriend: friendIds.includes(player.id),
      verifiedMatches: player.verifiedMatches ?? Math.max(0, player.wins + player.losses - 2),
      winRate: player.winRate ?? Math.round((player.wins / Math.max(1, player.wins + player.losses)) * 100),
      status: player.status || (friendIds.includes(player.id) ? 'available' : 'recentlyActive'),
    }));
  }, [account, courts, friendIds]);

  const currentUser = players[0];

  const createAccount = (nextAccount: LocalAccount) => {
    const enriched = {
      ...nextAccount,
      id: nextAccount.id || 'p1',
      createdAt: nextAccount.createdAt || new Date().toISOString(),
      subscriptionTier: nextAccount.subscriptionTier || 'free',
      walletBalance: nextAccount.walletBalance ?? 0,
      credits: nextAccount.credits ?? 120,
      cosmeticsOwned: nextAccount.cosmeticsOwned || ['Classic Maroon'],
      activeTheme: nextAccount.activeTheme || 'Maroon Glass',
      accountRole: nextAccount.accountRole || 'player',
    };
    setAccount(enriched);
    accountService.saveAccount(enriched).catch(() => undefined);
  };
  const loginAccount = async (usernameOrEmail: string) => {
    const stored = await accountService.login(usernameOrEmail);
    if (!stored) return false;
    setAccount(stored);
    return true;
  };
  const updateAccount = (patch: Partial<LocalAccount>) => {
    if (!account) return;
    const next = { ...account, ...patch };
    setAccount(next);
    accountService.saveAccount(next).catch(() => undefined);
  };

  const joinOpenGame = (id: string) => {
    setOpenGames((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const playerIds = item.playerIds.includes(currentUser.id) ? item.playerIds : [...item.playerIds, currentUser.id];
        return { ...item, joined: true, playerIds };
      }),
    );
  };

  const addFriend = (id: string) =>
    setFriendIds((items) => {
      if (!canRunAction(`friend-${id}`, 900)) return items;
      const next = items.includes(id) ? items : [...items, id];
      accountService.saveFriendIds(next).catch(() => undefined);
      return next;
    });
  const removeFriend = (id: string) =>
    setFriendIds((items) => {
      const next = items.filter((item) => item !== id);
      accountService.saveFriendIds(next).catch(() => undefined);
      return next;
    });

  const createChallenge = (input: CreateChallengeInput) => {
    if (!canRunAction(`challenge-${currentUser.id}-${input.courtId}`, 1800)) return challenges[0];
    const challenge: Challenge = {
      id: `local-${Date.now()}`,
      from: currentUser.id,
      to: input.opponentId || input.opponentIds?.[0] || 'open',
      opponentIds: input.opponentIds || (input.opponentId ? [input.opponentId] : []),
      courtId: input.courtId,
      startsAt: input.startsAt,
      level: input.level,
      status: 'Sent',
      type: input.type || 'doubles',
      note: sanitizeText(input.note || '', 180),
      isPrivate: input.privacy === 'Private invite',
      privacy: input.privacy,
    };
    setChallenges((items) => [challenge, ...items]);
    if (challenge.privacy === 'Public' && challenge.to === 'open') {
      setOpenGames((items) => [
        {
          id: `og-${challenge.id}`,
          courtId: challenge.courtId,
          startsAt: challenge.startsAt,
          level: challenge.level,
          hostId: currentUser.id,
          playerIds: [currentUser.id],
          capacity: challenge.type === 'singles' ? 2 : 4,
          privacy: challenge.privacy,
        },
        ...items,
      ]);
    }
    return challenge;
  };

  const updateChallenge = (id: string, status: ChallengeStatus) => {
    setChallenges((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const addMatch = (match: Match) => {
    if (!canRunAction(`match-${currentUser.id}-${match.courtId}`, 1800)) return;
    setMatches((items) => [match, ...items]);
  };
  const updateMatchStatus = (id: string, status: MatchStatus) => {
    const target = matches.find((match) => match.id === id);
    setMatches((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    if (status === 'Verified' && target && [...target.teamA, ...target.teamB].includes(currentUser.id) && canRunAction(`verified-credit-${id}`, 60 * 60 * 1000)) {
      const delta = rankingService.previewDelta(players, target);
      const nextPlayer = rankingService.applyConfirmedMatch(currentUser, { ...target, status: 'Verified' }, delta);
      updateAccount({
        rating: nextPlayer.rating,
        weeklyPoints: nextPlayer.weeklyPoints,
        verifiedMatches: nextPlayer.verifiedMatches,
      });
      const creditAmount = nextPlayer.streak >= 3 ? 180 : 120;
      setWallet((next) => ({
        ...next,
        credits: next.credits + creditAmount,
        transactions: [{ id: `tx-${Date.now()}`, userId: currentUser.id, amount: creditAmount, reason: nextPlayer.streak >= 3 ? 'winStreak' : 'verifiedMatch', createdAt: new Date().toISOString() }, ...next.transactions],
      }));
    }
  };
  const requestCoachSession = (id: string, slot: string) => {
    setCoaches((items) => items.map((coach) => (coach.id === id ? { ...coach, requested: true, availableSlots: coach.availableSlots.filter((item) => item !== slot) } : coach)));
  };
  const toggleVideoLike = (id: string) => setVideos((items) => items.map((video) => (video.id === id ? { ...video, liked: !video.liked } : video)));
  const toggleVideoSave = (id: string) => setVideos((items) => items.map((video) => (video.id === id ? { ...video, saved: !video.saved } : video)));
  const previewCosmetic = (_id: string) => undefined;
  const selectCosmetic = (id: string) => {
    const item = cosmetics.find((cosmetic) => cosmetic.id === id);
    if (!item || !item.unlocked) return;
    setCosmetics((items) =>
      items.map((cosmetic) => (cosmetic.type === item.type ? { ...cosmetic, equipped: cosmetic.id === id } : cosmetic)),
    );
    setActiveCosmeticIds((items) => [id, ...items.filter((activeId) => cosmetics.find((cosmetic) => cosmetic.id === activeId)?.type !== item.type && activeId !== id)]);
  };
  const buyCosmetic = (id: string) => {
    const item = cosmetics.find((cosmetic) => cosmetic.id === id);
    if (!item || item.unlocked || wallet.credits < item.price) return false;
    if (item.premiumOnly && currentUser.subscriptionTier !== 'Premium') return false;
    setWallet((next) => ({
      ...next,
      credits: next.credits - item.price,
      transactions: [
        { id: `tx-${Date.now()}`, userId: currentUser.id, amount: -item.price, reason: 'cosmeticSpend', createdAt: new Date().toISOString() },
        ...next.transactions,
      ],
    }));
    setCosmetics((items) =>
      items.map((cosmetic) => (cosmetic.type === item.type ? { ...cosmetic, unlocked: cosmetic.id === id ? true : cosmetic.unlocked, equipped: cosmetic.id === id } : cosmetic)),
    );
    setActiveCosmeticIds((items) => [id, ...items.filter((activeId) => cosmetics.find((cosmetic) => cosmetic.id === activeId)?.type !== item.type && activeId !== id)]);
    return true;
  };
  const earnCredits = (amount: number, reason: Wallet['transactions'][number]['reason']) => {
    setWallet((next) => ({
      ...next,
      credits: next.credits + amount,
      transactions: [{ id: `tx-${Date.now()}`, userId: currentUser.id, amount, reason, createdAt: new Date().toISOString() }, ...next.transactions],
    }));
  };
  const createCoachProfile = (input: Omit<Coach, 'id' | 'rating' | 'requested'>) => {
    const coach: Coach = {
      ...input,
      specialty: sanitizeText(input.specialty, 80),
      bio: sanitizeText(input.bio, 300),
      id: `coach-local-${Date.now()}`,
      rating: 5,
      requested: false,
    };
    setCoaches((items) => [coach, ...items]);
    return coach;
  };
  const uploadVideo = (input: Omit<VideoPost, 'id' | 'creatorId' | 'creatorName' | 'views' | 'createdAt'>) => {
    const video: VideoPost = {
      ...input,
      title: sanitizeText(input.title, 100),
      description: sanitizeText(input.description, 300),
      id: `video-local-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    setVideos((items) => [video, ...items]);
    earnCredits(40, 'clipUploaded');
    return video;
  };

  const value = { account, currentUser, players, courts, openGames, challenges, matches, coaches, videos, wallet, cosmetics, activeCosmeticIds, friendIds, createAccount, loginAccount, updateAccount, addFriend, removeFriend, joinOpenGame, createChallenge, updateChallenge, addMatch, updateMatchStatus, requestCoachSession, toggleVideoLike, toggleVideoSave, previewCosmetic, selectCosmetic, buyCosmetic, earnCredits, createCoachProfile, uploadVideo };

  return <AppStateContext.Provider value={value}>{hydrated ? children : null}</AppStateContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}
