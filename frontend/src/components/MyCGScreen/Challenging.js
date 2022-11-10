import React from "react-native"
import { View, ScrollView, Image, Dimensions } from "react-native"
// import { useNavigation } from "@react-navigation/native"
import AppText from "../common/AppText"
import AppBoldText from "../common/AppBoldText"
import styled from "styled-components"
import ChallengingCard from "./ChallengingCard"
import {
  RankingChallengeIcon,
  NormalChallengeIcon,
} from "../../assets/images/MyCGScreen/MyCGScreen"
import { useState, useEffect, useContext } from "react"
import AppModal from "../common/AppModal"
import Feed from "./Feed"
import { AuthorizationInstance } from "../../api/settings"
import { RoomContext } from "../../../store/room-context"

const Challenging = ({ navigation }) => {
  // const navigation = useNavigation()
  const [rankingCGList, setRankingCGList] = useState([])
  const [userCGList, setUserCGList] = useState([])

  const instance = AuthorizationInstance()

  useEffect(() => {
    const focusHandler = navigation.addListener("focus", () => {
      const reload = async () => {
        const res = await instance.get("/api/user/ongoing")
        const NewRankingCGList = res.data.rankingChallengeList
        const NewUserCGList = res.data.userChallengeList
        setRankingCGList(NewRankingCGList)
        setUserCGList(NewUserCGList)
      }
      reload()
    })
    return focusHandler
  }, [navigation])

  // const tempRankingCGList = [
  //   {
  //     challengeId: 34,
  //     challengeImg: "https://homybk.s3.ap-northeast-2.amazonaws.com/cat.jpg",
  //     challengeName: "찬호와 아이들",
  //     challengeTopic: "하루 3잔 물마시기",
  //     startDate: new Date(2022, 10, 5),
  //     endDate: new Date(2022, 10, 10),
  //     peopleCnt: 4,
  //   },
  // ]

  // const tempUserCGList = [
  //   {
  //     challengeId: 35,
  //     // challengeImg: "https://homybk.s3.ap-northeast-2.amazonaws.com/cat.jpg",
  //     challengeName: "찬호와 아이들",
  //     challengeTopic: "하루 3잔 물마시기",
  //     startDate: new Date(2022, 10, 5),
  //     endDate: new Date(2022, 10, 10),
  //     peopleCnt: 4,
  //   },
  // ]

  // 이미 나열되어 있는 리스트를 눌러 CGRoom에 진입하는 경우
  const roomCtx = useContext(RoomContext)

  const pressHandler = (id) => {
    roomCtx.getRoomInfo(id)
    roomCtx.getUserList(id)
    navigation.push("CGRoom")
  }

  useEffect(() => {
    // 리스트 렌더링
    const getChallenge = async () => {
      try {
        const res = await instance.get("/api/user/ongoing")
        const NewRankingCGList = res.data.rankingChallengeList
        const NewUserCGList = res.data.userChallengeList
        setRankingCGList(NewRankingCGList)
        setUserCGList(NewUserCGList)
      } catch (err) {
        console.log(err)
      }
    }
    getChallenge()
  }, [])

  return (
    <ScrollBackground>
      <DivideView>
        <IconView>
          <RankingChallengeIcon />
        </IconView>
        <AppBoldText>랭킹 챌린지</AppBoldText>
      </DivideView>
      {rankingCGList.map((challengeInfo) => (
        <ChallengingCard
          key={challengeInfo.challengeId}
          challengeInfo={challengeInfo}
          func={() => {
            pressHandler(challengeInfo.challengeId)
          }}
        />
      ))}
      <DivideView>
        <IconView>
          <NormalChallengeIcon />
        </IconView>
        <AppBoldText>일반 챌린지</AppBoldText>
      </DivideView>
      {userCGList.map((challengeInfo) => (
        <ChallengingCard
          key={challengeInfo.challengeId}
          challengeInfo={challengeInfo}
          func={() => {
            pressHandler(challengeInfo.challengeId)
          }}
        />
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
  height: 50px;
`
