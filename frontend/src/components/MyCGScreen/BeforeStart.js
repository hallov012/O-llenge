import React from "react-native"
import { Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import AppBoldText from "../common/AppBoldText"
import styled from "styled-components"
import BeforeStartCard from "./BeforeStartCard"
import {
  RankingChallengeIcon,
  NormalChallengeIcon,
} from "../../assets/images/MyCGScreen/MyCGScreen"
import { FAB, Portal, Provider } from "react-native-paper"
import { useState, useEffect } from "react"
import { AuthorizationInstance } from "../../api/settings"

const BeforeStart = (props) => {
  const navigation = useNavigation()
  const [rankingCGList, setRankingCGList] = useState([])
  const [userCGList, setUserCGList] = useState([])
  const instance = AuthorizationInstance()
  const [fabButton, setfabButton] = useState(false)

  const onStateChange = () => {
    setfabButton(!fabButton)
  }

  const tempRankingCGList = [
    {
      challengeId: 34,
      challengeImg: "https://homybk.s3.ap-northeast-2.amazonaws.com/cat.jpg",
      challengeName: "찬호와 아이들",
      challengeTopic: "하루 3잔 물마시기",
      startDate: new Date(2022, 10, 10),
      endDate: new Date(2022, 10, 15),
      peopleCnt: 4,
    },
  ]

  const tempUserCGList = [
    {
      challengeId: 35,
      challengeImg: "https://homybk.s3.ap-northeast-2.amazonaws.com/cat.jpg",
      challengeName: "찬호와 아이들",
      challengeTopic: "하루 3잔 물마시기",
      startDate: new Date(2022, 10, 10),
      endDate: new Date(2022, 10, 15),
      peopleCnt: 4,
    },
  ]

  useEffect(() => {
    const getChallenge = async () => {
      try {
        const res = await instance.get("/api/user/scheduled")
        const NewRankingCGList = res.data.rankingChallengeList
        const NewUserCGList = res.data.userChallengeList
        setRankingCGList(NewRankingCGList)
        setUserCGList(NewUserCGList)
      } catch (err) {
        // console.log(err)
      }
    }
    getChallenge()
  }, [])

  const pressHandler = (id) => {
    props.idHandler(id)
    navigation.push("CGRoom")
  }

  return (
    <Provider>
      <Portal>
        <ScrollBackground>
          <DivideView>
            <IconView>
              <RankingChallengeIcon />
            </IconView>
            <AppBoldText>랭킹 챌린지</AppBoldText>
          </DivideView>
          {tempRankingCGList.map((challengeInfo) => (
            <BeforeStartCard
              key={challengeInfo.challengeId}
              challengeInfo={challengeInfo}
              func={() => {
                pressHandler(challengeInfo.challengeId)
              }}
            />
          ))}
          {/* {rankingCGList.map((challengeInfo) => (
            <BeforeStartCard
              key={challengeInfo.challengeId}
              challengeInfo={challengeInfo}
              func={() => {
                pressHandler(challengeInfo.challengeId)
              }}
            />
          ))} */}
          <DivideView>
            <IconView>
              <NormalChallengeIcon />
            </IconView>
            <AppBoldText>일반 챌린지</AppBoldText>
          </DivideView>
          {tempUserCGList.map((challengeInfo) => (
            <BeforeStartCard
              key={challengeInfo.challengeId}
              challengeInfo={challengeInfo}
              func={() => {
                pressHandler(challengeInfo.challengeId)
              }}
            />
          ))}
          {/* {userCGList.map((challengeInfo) => (
            <BeforeStartCard
              key={challengeInfo.challengeId}
              challengeInfo={challengeInfo}
              func={() => {
                pressHandler(challengeInfo.challengeId)
              }}
            />
          ))} */}
        </ScrollBackground>
        <FAB.Group
          open={fabButton}
          visible
          icon={fabButton ? "minus" : "plus"}
          color="white"
          fabStyle={{
            backgroundColor: "#FCBE32",
            borderRadius: 100,
          }}
          actions={[
            {
              icon: "barcode-scan",
              label: "초대 코드 입력",
              color: "white",
              onPress: () => console.log("여기 함수 넣자"),
              labelStyle: {
                color: "#FCBE32",
                fontWeight: "bold",
              },
              style: {
                backgroundColor: "#FCBE32",
                borderRadius: 100,
              },
              size: "medium",
            },
            {
              icon: "run",
              label: "새 챌린지 생성",
              labelStyle: {
                fontWeight: "bold",
                color: "#FCBE32",
              },
              color: "white",
              onPress: () => console.log("여기 함수 넣자"),
              style: {
                color: "white",
                borderRadius: 100,
                backgroundColor: "#FCBE32",
              },
              size: "medium",
            },
          ]}
          onStateChange={onStateChange}
        />
      </Portal>
    </Provider>
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
export default BeforeStart

const IconView = styled.View`
  width: 15%;
  height: 50px;
`
