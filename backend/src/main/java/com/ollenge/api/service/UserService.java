package com.ollenge.api.service;

import com.ollenge.api.exception.*;
import com.ollenge.api.request.BadgePatchReq;
import com.ollenge.api.request.ReportUserReq;
import com.ollenge.api.response.data.TotalUserRankData;
import com.ollenge.api.response.data.UserCompletedChallengeData;
import com.ollenge.api.response.data.UserOngoingChallengeData;
import com.ollenge.api.response.data.UserScheduledChallengeData;
import com.ollenge.common.util.JwtTokenUtil;
import com.ollenge.common.util.StringUtils;
import com.ollenge.db.entity.Badge;
import com.ollenge.db.entity.Report;
import com.ollenge.db.entity.User;
import com.ollenge.db.repository.BadgeRepository;
import com.ollenge.db.repository.ReportRepository;
import com.ollenge.db.repository.UserRepository;
import com.ollenge.db.repository.UserRepositorySupport;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserRepositorySupport userRepositorySupport;
    private final BadgeRepository badgeRepository;
    private final ReportRepository reportRepository;

    public User getUserByUserId(long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) return user.get();
        return null;
    }

    public long getUserIdByAuthCode(String authCode) {
        User user = userRepository.findUserByAuthCode(authCode).get();
        return user.getUserId();
    }

    public User updateUserInfo(long userId, String nickname, String profileImg, String userDescription) throws DuplicatedNicknameException, InvalidNicknameException, InvalidUserDescriptionException {
        User user = userRepository.findById(userId).get();

        if (user == null) return null;

        if (nickname != null) {
            if (nickname.length() < 2 || nickname.length() > 14 || !StringUtils.isValidStringWithoutSpace(nickname)) {
                throw new InvalidNicknameException("형식에 맞지 않는 닉네임입니다");
            }
            if (userRepository.findUserByNickname(nickname).isPresent()) {
                throw new DuplicatedNicknameException("이미 존재하는 닉네임입니다");
            }
            user.setNickname(nickname);
            user.setUserFlag(true);
        }

        if (profileImg != null) user.setProfileImg(profileImg);

        if (userDescription != null) {
            if (userDescription.length() > 100) {
                throw new InvalidUserDescriptionException("입력 형식에 맞지 않습니다");
            }
            user.setUserDescription(userDescription);
        }

        return userRepository.save(user);
    }

    public List<UserOngoingChallengeData> getUserOngoingRankingChallenge(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<UserOngoingChallengeData> rankingChallengeList = userRepositorySupport.getUserOngoingChallenge(user, true);
        return rankingChallengeList;
    }

    public List<UserOngoingChallengeData> getUserOngoingUserChallenge(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<UserOngoingChallengeData> userChallengeList = userRepositorySupport.getUserOngoingChallenge(user, false);
        return userChallengeList;
    }

    public List<UserScheduledChallengeData> getUserScheduledRankingChallenge(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<UserScheduledChallengeData> rankingChallengeList = userRepositorySupport.getUserScheduledChallenge(user, true);
        return rankingChallengeList;
    }

    public List<UserScheduledChallengeData> getUserScheduledUserChallenge(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<UserScheduledChallengeData> userChallengeList = userRepositorySupport.getUserScheduledChallenge(user, false);
        return userChallengeList;
    }

    public List<UserCompletedChallengeData> getUserCompletedRankingChallenge(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<UserCompletedChallengeData> rankingChallengeList = userRepositorySupport.getUserCompletedChallenge(user, true);
        return rankingChallengeList;
    }

    public List<UserCompletedChallengeData> getUserCompletedUserChallenge(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<UserCompletedChallengeData> userChallengeList = userRepositorySupport.getUserCompletedChallenge(user, false);
        return userChallengeList;
    }
    public List<TotalUserRankData> getTotalUserRank(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        List<TotalUserRankData> totalUserRankDataList = userRepositorySupport.getTotalUserRank();

        return totalUserRankDataList;
    }

    public TotalUserRankData getUserRank(Authentication authentication) throws InvalidUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        TotalUserRankData userRank = userRepositorySupport.getUserRank(user);
        return userRank;
    }

    public void updateProfileBadge(Authentication authentication, BadgePatchReq badgePatchReq) throws InvalidUserException, InvalidBadgeException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        Badge badge = badgeRepository.findById(badgePatchReq.getBadgeId())
                .orElseThrow(() -> { return new InvalidBadgeException("Invalid Badge Id " + badgePatchReq.getBadgeId()); });
        if(badge.getUser() != user) {
            throw new InvalidBadgeException("Invalid Badge Id " + badgePatchReq.getBadgeId());
        }
        user.setBadge(badge);
        userRepository.save(user);
    }

    public void updateBadgeStatus(Authentication authentication, BadgePatchReq badgePatchReq) throws InvalidUserException, InvalidBadgeException, InvalidBadgeStatusException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        Badge badge = badgeRepository.findById(badgePatchReq.getBadgeId())
                .orElseThrow(() -> { return new InvalidBadgeException("Invalid Badge Id " + badgePatchReq.getBadgeId()); });
        if(badge.getUser() != user) {
            throw new InvalidBadgeException("Invalid Badge Id " + badgePatchReq.getBadgeId());
        }
        if (badge.isBadgeFlag()) {
            throw new InvalidBadgeStatusException("Already activated badge");
        }
        badge.setBadgeFlag(true);
        badgeRepository.save(badge);
    }

    public void reportUser(Authentication authentication, ReportUserReq reportUserReq) throws InvalidUserException, InvalidReqUserException {
        long userId = JwtTokenUtil.getUserIdByJWT(authentication);
        User reportUser = userRepository.findById(userId)
                .orElseThrow(() -> { return new InvalidUserException("Invalid ID " + userId); });
        User reportedUser = userRepository.findById(reportUserReq.getReportedUserId())
                .orElseThrow(() -> { return new InvalidReqUserException("Invalid ID " + userId); });
        reportRepository.save(Report.builder().reportUserId(reportUser).reportedUserId(reportedUser).reportContent(reportUserReq.getReportContent()).build());
    }
}
