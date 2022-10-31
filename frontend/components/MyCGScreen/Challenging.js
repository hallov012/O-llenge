import React from "react-native"
import { View, ScrollView, Image, Dimensions } from "react-native"
import AppText from "../common/AppText"
import styled from "styled-components"
import ChallengingCard from "./ChallengingCard"
import {
  RankingChallengeIcon,
  NormalChallengeIcon,
} from "../../assets/images/MyCGScreen/MyCGScreen"

const Challenging = () => {
  const tempList = [
    {
      isChallenge: true,
      title: "하루 3잔 물마시기",
      teamName: "찬호와 아이들",
      memberNumber: 4,
      progress: 50,
      startDate: "10.26",
      endDate: "11.05",
    },
    {
      isChallenge: true,
      title: "하루 3잔 물마시기",
      teamName: "찬호와 아이들",
      memberNumber: 4,
      progress: 50,
      startDate: "10.26",
      endDate: "11.05",
    },
    {
      isChallenge: false,
      title: "하루 3잔 물마시기",
      teamName: "찬호와 아이들",
      memberNumber: 4,
      progress: 50,
      startDate: "10.26",
      endDate: "11.05",
    },
  ]

  return (
    <ScrollBackground>
      <DivideView>
        <IconView>
          <RankingChallengeIcon />
        </IconView>
        <AppText size="30">랭킹 챌린지</AppText>
      </DivideView>
      {tempList
        .filter((listItem) => listItem.isChallenge)
        .map((challengeInfo, idx) => (
          <ChallengingCard key={idx} challengeInfo={challengeInfo} />
        ))}
      <DivideView>
        <IconView>
          <NormalChallengeIcon />
        </IconView>
        <AppText size="30">일반 챌린지</AppText>
      </DivideView>
      {tempList
        .filter((listItem) => !listItem.isChallenge)
        .map((challengeInfo, idx) => (
          <ChallengingCard key={idx} challengeInfo={challengeInfo} />
        ))}
    </ScrollBackground>
  )
}

const fivePercent = (Dimensions.get("window").width * 0.05) / 2

const ScrollBackground = styled.ScrollView`
  background: #edf8ff;
`

const DivideView = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 10px ${fivePercent}px;
`
export default Challenging

const IconView = styled.View`
  width: 15%;
  height: 50;
`
