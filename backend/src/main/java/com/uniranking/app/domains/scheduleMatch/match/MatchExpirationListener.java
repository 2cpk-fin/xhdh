package com.uniranking.app.domains.scheduleMatch.match;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.KeyExpirationEventMessageListener;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

// KeyExpirationEventMessageListener receives each message, which contains the name of the key that just expired — not the value (it's already gone)
@Component
public class MatchExpirationListener extends KeyExpirationEventMessageListener {
    // We set data key to the leaderboard for syncing
    // and shadow key for status for notification

    private final ScheduleMatchRepository scheduleMatchRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final AfterMatchCalculator afterMatchCalculator;

    private static final String STATUS_PREFIX = "status:match:";
    private static final String LEADERBOARD_PREFIX = "leaderboard:match:";


    public MatchExpirationListener(RedisMessageListenerContainer listenerContainer,
                                   ScheduleMatchRepository scheduleMatchRepository,
                                   RedisTemplate<String, Object> redisTemplate,
                                   AfterMatchCalculator afterMatchCalculator) {
        super(listenerContainer);
        this.scheduleMatchRepository = scheduleMatchRepository;
        this.redisTemplate = redisTemplate;
        this.afterMatchCalculator = afterMatchCalculator;
    }

    // When ever some status keys expiring, the system will receive a message
    // , and then it starts to sync the data key to the DB and delete the data key
    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();

        // We only care about the status key expiring
        if (expiredKey.startsWith(STATUS_PREFIX)) {
            String publicMatchId = expiredKey.replace(STATUS_PREFIX, "");

            // Try to atomically claim NOT_STARTED → PENDING
            int updatedToStart = scheduleMatchRepository.compareAndUpdateStatus(UUID.fromString(publicMatchId), Status.NOT_STARTED, Status.PENDING);
            if (updatedToStart == 1) {
                startMatch(publicMatchId);
                return;
            }

            // Try to atomically claim PENDING → FINISHED
            int updatedToFinish = scheduleMatchRepository.compareAndUpdateStatus(UUID.fromString(publicMatchId), Status.PENDING, Status.FINISHED);
            if (updatedToFinish == 1) {
                syncFinalResults(publicMatchId);
            }
        }
    }

    private void startMatch(String publicMatchId) {
        ScheduleMatch match = scheduleMatchRepository.findByPublicMatchId(UUID.fromString(publicMatchId));
        if (match == null) return;

        long secondsToEnd = Duration.between(LocalDateTime.now(), match.getEndTime()).getSeconds();
        Duration ttl = Duration.ofSeconds(Math.max(secondsToEnd, 1));

        String statusKey = STATUS_PREFIX + publicMatchId;
        redisTemplate.opsForValue().set(statusKey, Status.PENDING.name(), ttl);
    }

    protected void syncFinalResults(String publicMatchId) {
        String leaderboardKey = LEADERBOARD_PREFIX + publicMatchId;

        // Hand off the entire finalization process to the EloCalculator
        // It handles syncVotesToDatabase, calculateAndApplyGroupElo, and DB save
        afterMatchCalculator.afterMatchCalculation(publicMatchId, leaderboardKey);
    }
}